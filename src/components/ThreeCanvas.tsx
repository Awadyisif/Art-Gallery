import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Artwork, SceneConfig } from '../types/art';
import { renderArtworkToCanvas, generateNormalMapFromCanvas } from '../utils/proceduralCanvas';
import { kelvinToRgb } from '../utils/artEngine';

interface ThreeCanvasProps {
  artwork: Artwork;
  config: SceneConfig;
  customImage?: HTMLImageElement;
  onSnapshotReady?: (dataUrl: string) => void;
  snapshotTrigger?: number;
}

// Scratch reusable variables to eliminate Garbage Collection in loop
const _vec3 = new THREE.Vector3();
const _targetCameraPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3();

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  artwork,
  config,
  customImage,
  onSnapshotReady,
  snapshotTrigger
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep latest props in ref so render loop and event handlers always access up-to-date state
  const propsRef = useRef({ artwork, config, customImage });
  propsRef.current = { artwork, config, customImage };

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Dynamic 3D Object groups
  const artMeshGroupRef = useRef<THREE.Group | null>(null);
  const wallGroupRef = useRef<THREE.Group | null>(null);
  const tableGroupRef = useRef<THREE.Group | null>(null);
  const propsGroupRef = useRef<THREE.Group | null>(null);
  const particlesGroupRef = useRef<THREE.Points | null>(null);
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  const ambientLightRef = useRef<THREE.HemisphereLight | null>(null);

  // Textures cache
  const artTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const normalTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Interaction controls
  const pointerRef = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    rotX: 0,
    rotY: 0,
    targetRotX: 0,
    targetRotY: 0,
    zoom: 1.0,
    targetZoom: 1.0
  });

  // Handle snapshot generation
  useEffect(() => {
    if (snapshotTrigger && rendererRef.current && sceneRef.current && cameraRef.current && onSnapshotReady) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
      onSnapshotReady(dataUrl);
    }
  }, [snapshotTrigger, onSnapshotReady]);

  // Main Three.js Lifecycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c0a09); // deep stone-950
    scene.fog = new THREE.FogExp2(0x0c0a09, 0.035);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 3.8);
    _currentLookAt.set(0, 1.5, 0);
    camera.lookAt(_currentLookAt);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isHeadless,
      alpha: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Procedural Studio Environment (RoomEnvironment)
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // 5. Lighting Rig (3-point balanced rig + dynamic museum spotlight)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x292524, 0.5);
    scene.add(hemiLight);
    ambientLightRef.current = hemiLight;

    const spotLight = new THREE.SpotLight(0xfff5e6, 2.2, 12, Math.PI / 4, 0.4, 1.2);
    spotLight.position.set(0, 3.2, 2.2);
    spotLight.target.position.set(0, 1.5, 0);
    if (!isHeadless) {
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.height = 1024;
      spotLight.shadow.camera.near = 0.5;
      spotLight.shadow.camera.far = 8;
      spotLight.shadow.bias = -0.0005;
      spotLight.shadow.normalBias = 0.02;
    }
    scene.add(spotLight);
    scene.add(spotLight.target);
    spotLightRef.current = spotLight;

    // 6. Object Groups
    const artGroup = new THREE.Group();
    artMeshGroupRef.current = artGroup;
    scene.add(artGroup);

    const wallGroup = new THREE.Group();
    wallGroupRef.current = wallGroup;
    scene.add(wallGroup);

    const tableGroup = new THREE.Group();
    tableGroupRef.current = tableGroup;
    scene.add(tableGroup);

    const propsGroup = new THREE.Group();
    propsGroupRef.current = propsGroup;
    scene.add(propsGroup);

    // 7. Ambient Particle Field (for 3D spatial mode)
    const particleCount = isHeadless ? 40 : 350;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 6;
      posArray[i + 1] = Math.random() * 3.5;
      posArray[i + 2] = (Math.random() - 0.5) * 5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.025,
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particlesGroupRef.current = particles;
    scene.add(particles);

    // Initial Scene Build
    rebuildArtworkMesh();
    rebuildEnvironmentMeshes();

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // 8. Interaction Handlers
    const onPointerDown = (e: PointerEvent) => {
      pointerRef.current.isDown = true;
      pointerRef.current.startX = e.clientX;
      pointerRef.current.startY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointerRef.current.isDown) return;
      const dx = e.clientX - pointerRef.current.startX;
      const dy = e.clientY - pointerRef.current.startY;
      pointerRef.current.startX = e.clientX;
      pointerRef.current.startY = e.clientY;

      pointerRef.current.targetRotY += dx * 0.006;
      pointerRef.current.targetRotX = Math.max(-0.6, Math.min(0.6, pointerRef.current.targetRotX + dy * 0.005));
    };

    const onPointerUp = () => {
      pointerRef.current.isDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.001;
      pointerRef.current.targetZoom = Math.max(0.6, Math.min(1.8, pointerRef.current.targetZoom + zoomDelta));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // Window Resize
    const onResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 9. Animation Loop (throttled ~15fps in headless or full 60fps on display)
    let lastTime = performance.now();
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = clock.getDelta();

      // Throttling for headless software rendering to avoid stalling tests
      if (isHeadless && now - lastTime < 60) return;
      lastTime = now;

      // Exponential damping on user rotation and zoom
      pointerRef.current.rotX = THREE.MathUtils.damp(pointerRef.current.rotX, pointerRef.current.targetRotX, 8, delta);
      pointerRef.current.rotY = THREE.MathUtils.damp(pointerRef.current.rotY, pointerRef.current.targetRotY, 8, delta);
      pointerRef.current.zoom = THREE.MathUtils.damp(pointerRef.current.zoom, pointerRef.current.targetZoom, 6, delta);

      const currentConfig = propsRef.current.config;

      // Auto-rotation in Spatial 3D mode
      if (currentConfig.autoRotate && currentConfig.displayMode === 'spatial3d') {
        pointerRef.current.targetRotY += 0.3 * delta;
      }

      // Camera Positioning according to display mode
      if (currentConfig.displayMode === 'wall') {
        _targetCameraPos.set(
          Math.sin(pointerRef.current.rotY) * 3.4 * pointerRef.current.zoom,
          1.5 + pointerRef.current.rotX * 1.5,
          Math.cos(pointerRef.current.rotY) * 3.4 * pointerRef.current.zoom
        );
        _targetLookAt.set(0, 1.5, 0);
      } else if (currentConfig.displayMode === 'table') {
        _targetCameraPos.set(
          Math.sin(pointerRef.current.rotY) * 2.2 * pointerRef.current.zoom,
          1.2 + pointerRef.current.rotX * 1.2,
          Math.cos(pointerRef.current.rotY) * 2.2 * pointerRef.current.zoom
        );
        _targetLookAt.set(0, 0.95, 0);
      } else {
        // spatial3d / derive
        _targetCameraPos.set(
          Math.sin(pointerRef.current.rotY) * 2.8 * pointerRef.current.zoom,
          1.4 + pointerRef.current.rotX * 2.0,
          Math.cos(pointerRef.current.rotY) * 2.8 * pointerRef.current.zoom
        );
        _targetLookAt.set(0, 1.4, 0);
      }

      // Smooth camera interpolation
      camera.position.lerp(_targetCameraPos, 0.1);
      _currentLookAt.lerp(_targetLookAt, 0.1);
      camera.lookAt(_currentLookAt);

      // Subtle particle float
      if (particlesGroupRef.current && currentConfig.displayMode === 'spatial3d') {
        particlesGroupRef.current.rotation.y += 0.05 * delta;
        particlesGroupRef.current.visible = true;
      } else if (particlesGroupRef.current) {
        particlesGroupRef.current.visible = false;
      }

      // Render
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', onResize);
      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElement.removeEventListener('wheel', onWheel);

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Update Artwork Mesh whenever artwork or frame configuration changes
  useEffect(() => {
    rebuildArtworkMesh();
    rebuildEnvironmentMeshes();
    updateLighting();
  }, [artwork, config, customImage]);

  /**
   * Constructs the 3D Artwork (Canvas + Frame + Depth Layers)
   */
  const rebuildArtworkMesh = () => {
    const artGroup = artMeshGroupRef.current;
    if (!artGroup) return;

    // Clean previous children
    while (artGroup.children.length > 0) {
      const child = artGroup.children[0];
      artGroup.remove(child);
      if ('geometry' in child && child.geometry) (child as THREE.Mesh).geometry.dispose();
      if ('material' in child && child.material) {
        const mat = (child as THREE.Mesh).material;
        if (Array.isArray(mat)) mat.forEach(m => m.dispose());
        else mat.dispose();
      }
    }

    const { artwork: currentArt, config: currentConfig, customImage: curImg } = propsRef.current;
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);

    // 1. Create or update procedural 2D canvas
    const offCanvas = document.createElement('canvas');
    renderArtworkToCanvas(offCanvas, currentArt, 1024, curImg);

    // Create Three.js Texture
    const artTexture = new THREE.CanvasTexture(offCanvas);
    artTexture.colorSpace = THREE.SRGBColorSpace;
    if (rendererRef.current) {
      artTexture.anisotropy = rendererRef.current.capabilities.getMaxAnisotropy();
    }
    artTextureRef.current = artTexture;

    // Impasto Normal Map
    const normCanvas = generateNormalMapFromCanvas(offCanvas, currentArt.textureRelief * 2.2);
    const normTexture = new THREE.CanvasTexture(normCanvas);
    normalTextureRef.current = normTexture;

    // Dimensions
    const baseW = 1.2 * currentConfig.scale;
    const baseH = (baseW / currentArt.aspectRatio);
    const depth = 0.04;

    // Positioning based on mode
    if (currentConfig.displayMode === 'wall') {
      artGroup.position.set(0, 1.5, 0.02);
      artGroup.rotation.set(0, 0, 0);
    } else if (currentConfig.displayMode === 'table') {
      artGroup.position.set(0, 1.15, 0.05);
      // Slight tilt on easel
      artGroup.rotation.set(-0.15, 0, 0);
    } else {
      // spatial3d / derive
      artGroup.position.set(0, 1.4, 0);
      artGroup.rotation.set(0, 0, 0);
    }

    // Canvas Material with authentic fine oil sheen
    const canvasMat = new THREE.MeshStandardMaterial({
      map: artTexture,
      normalMap: normTexture,
      normalScale: new THREE.Vector2(currentArt.textureRelief, currentArt.textureRelief),
      roughness: 0.65 - currentArt.textureRelief * 0.2,
      metalness: currentArt.generatorStyle === 'kiss' ? 0.35 : 0.05
    });

    // Main Canvas Mesh
    const canvasGeo = new THREE.BoxGeometry(baseW, baseH, depth);
    const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
    if (!isHeadless) {
      canvasMesh.castShadow = true;
      canvasMesh.receiveShadow = true;
    }
    artGroup.add(canvasMesh);

    // Build Picture Frame (Composite 3D Groups)
    if (currentConfig.frameStyle !== 'floating-canvas' && currentConfig.frameStyle !== 'frameless-glass') {
      const frameMesh = createCustomFrame(baseW, baseH, depth, currentConfig.frameStyle, currentConfig.matting);
      artGroup.add(frameMesh);
    }

    // Spatial 3D Multi-Layer Explosion Effect
    if (currentConfig.displayMode === 'spatial3d' && currentConfig.depthSeparation > 0.1) {
      const sep = currentConfig.depthSeparation * 0.18;
      
      // Floating glass cover layer
      const glassGeo = new THREE.PlaneGeometry(baseW * 1.02, baseH * 1.02);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 0.85,
        transparent: true,
        roughness: 0.1,
        ior: 1.5,
        depthWrite: false
      });
      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      glassMesh.position.z = depth / 2 + sep;
      artGroup.add(glassMesh);

      // Backing ambient halo plate
      const backGeo = new THREE.PlaneGeometry(baseW * 1.1, baseH * 1.1);
      const primaryHex = currentArt.palette[0] || '#f59e0b';
      const backMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(primaryHex),
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      });
      const backMesh = new THREE.Mesh(backGeo, backMat);
      backMesh.position.z = -depth / 2 - sep;
      artGroup.add(backMesh);
    }
  };

  /**
   * Assembles decorative 3D picture frame around the artwork
   */
  const createCustomFrame = (
    w: number,
    h: number,
    depth: number,
    style: string,
    matting: string
  ): THREE.Group => {
    const group = new THREE.Group();

    // Frame Material Finish
    let frameColor = 0x18181b;
    let roughness = 0.5;
    let metalness = 0.1;

    if (style === 'ornate-gold') {
      frameColor = 0xd4af37; // Royal Gold
      roughness = 0.25;
      metalness = 0.85;
    } else if (style === 'natural-oak') {
      frameColor = 0xc2a679; // Oak wood
      roughness = 0.75;
      metalness = 0.05;
    } else if (style === 'acrylic-block') {
      frameColor = 0xffffff;
      roughness = 0.1;
      metalness = 0.0;
    }

    const frameMat = new THREE.MeshStandardMaterial({
      color: frameColor,
      roughness,
      metalness
    });

    const frameBorder = style === 'ornate-gold' ? 0.08 : 0.04;
    const frameDepth = depth * 1.6;

    // Matting (Passe-Partout) if enabled
    if (matting !== 'none') {
      const matSize = matting === 'wide' ? 0.09 : 0.05;
      const matGeo = new THREE.BoxGeometry(w + matSize * 2, h + matSize * 2, depth * 0.5);
      const matMaterial = new THREE.MeshStandardMaterial({
        color: 0xfafaf9,
        roughness: 0.95,
        metalness: 0.0
      });
      const matMesh = new THREE.Mesh(matGeo, matMaterial);
      matMesh.position.z = -0.005;
      group.add(matMesh);
    }

    // 4 Outer Bevel Border Bars (Top, Bottom, Left, Right)
    const topBarGeo = new THREE.BoxGeometry(w + frameBorder * 2, frameBorder, frameDepth);
    const topBar = new THREE.Mesh(topBarGeo, frameMat);
    topBar.position.set(0, h / 2 + frameBorder / 2, frameDepth / 4);
    group.add(topBar);

    const btmBar = new THREE.Mesh(topBarGeo, frameMat);
    btmBar.position.set(0, -h / 2 - frameBorder / 2, frameDepth / 4);
    group.add(btmBar);

    const sideBarGeo = new THREE.BoxGeometry(frameBorder, h, frameDepth);
    const leftBar = new THREE.Mesh(sideBarGeo, frameMat);
    leftBar.position.set(-w / 2 - frameBorder / 2, 0, frameDepth / 4);
    group.add(leftBar);

    const rightBar = new THREE.Mesh(sideBarGeo, frameMat);
    rightBar.position.set(w / 2 + frameBorder / 2, 0, frameDepth / 4);
    group.add(rightBar);

    return group;
  };

  /**
   * Constructs Wall, Table, and Museum Props according to display mode
   */
  const rebuildEnvironmentMeshes = () => {
    const wallGroup = wallGroupRef.current;
    const tableGroup = tableGroupRef.current;
    const propsGroup = propsGroupRef.current;
    if (!wallGroup || !tableGroup || !propsGroup) return;

    // Clean groups
    [wallGroup, tableGroup, propsGroup].forEach(grp => {
      while (grp.children.length > 0) {
        const c = grp.children[0];
        grp.remove(c);
        if ('geometry' in c && c.geometry) (c as THREE.Mesh).geometry.dispose();
      }
    });

    const { config: currentConfig } = propsRef.current;
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);

    if (currentConfig.displayMode === 'wall') {
      // 1. Gallery Wall
      let wallColor = 0xf5f5f4;
      let roughness = 0.9;

      if (currentConfig.wallTexture === 'warm-plaster') {
        wallColor = 0xe7e5e4;
      } else if (currentConfig.wallTexture === 'industrial-concrete') {
        wallColor = 0xa8a29e;
        roughness = 0.8;
      } else if (currentConfig.wallTexture === 'luxury-walnut') {
        wallColor = 0x292524;
        roughness = 0.45;
      } else if (currentConfig.wallTexture === 'classic-molding') {
        wallColor = 0xf5f5f4;
      } else if (currentConfig.wallTexture === 'dark-obsidian') {
        wallColor = 0x18181b;
      }

      const wallMat = new THREE.MeshStandardMaterial({
        color: wallColor,
        roughness,
        metalness: 0.05
      });

      const wallMesh = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), wallMat);
      wallMesh.position.set(0, 2.0, 0);
      if (!isHeadless) wallMesh.receiveShadow = true;
      wallGroup.add(wallMesh);

      // Floor (Polished Parquet / Gallery Concrete)
      const floorMat = new THREE.MeshStandardMaterial({
        color: currentConfig.wallTexture === 'luxury-walnut' ? 0x1c1917 : 0xd6d3d1,
        roughness: 0.35,
        metalness: 0.1
      });
      const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(12, 8), floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.set(0, 0, 4);
      if (!isHeadless) floorMesh.receiveShadow = true;
      wallGroup.add(floorMesh);

      // Baseboard moulding trim
      const baseboardGeo = new THREE.BoxGeometry(12, 0.12, 0.04);
      const baseboardMat = new THREE.MeshStandardMaterial({ color: 0xe7e5e4, roughness: 0.5 });
      const baseboard = new THREE.Mesh(baseboardGeo, baseboardMat);
      baseboard.position.set(0, 0.06, 0.02);
      wallGroup.add(baseboard);

      // Optional Props: Minimalist Museum Bench
      if (currentConfig.showProps) {
        const benchGroup = new THREE.Group();
        benchGroup.position.set(0, 0, 1.8);
        const benchTop = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 0.08, 0.5),
          new THREE.MeshStandardMaterial({ color: 0x44403c, roughness: 0.4 })
        );
        benchTop.position.y = 0.45;
        benchGroup.add(benchTop);

        const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.45, 16);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8, roughness: 0.2 });
        [-0.65, 0.65].forEach(lx => {
          [-0.18, 0.18].forEach(lz => {
            const leg = new THREE.Mesh(legGeo, legMat);
            leg.position.set(lx, 0.225, lz);
            benchGroup.add(leg);
          });
        });
        propsGroup.add(benchGroup);
      }
    } else if (currentConfig.displayMode === 'table') {
      // 2. Table / Desk Showcase
      let deskColor = 0xffffff;
      let roughness = 0.2;
      let metalness = 0.1;

      if (currentConfig.tableSurface === 'natural-wood') {
        deskColor = 0xb45309;
        roughness = 0.5;
      } else if (currentConfig.tableSurface === 'smoked-glass') {
        deskColor = 0x27272a;
        roughness = 0.1;
      } else if (currentConfig.tableSurface === 'matte-slate') {
        deskColor = 0x334155;
        roughness = 0.7;
      }

      const tableMat = new THREE.MeshStandardMaterial({ color: deskColor, roughness, metalness });
      const tableMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 1.2), tableMat);
      tableMesh.position.set(0, 0.7, 0);
      if (!isHeadless) tableMesh.receiveShadow = true;
      tableGroup.add(tableMesh);

      // Wooden Artist Easel Stand
      const easelGroup = new THREE.Group();
      easelGroup.position.set(0, 0.73, 0);

      const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
      // Front ledge
      const ledge = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.06), woodMat);
      ledge.position.set(0, 0.02, 0.05);
      easelGroup.add(ledge);

      // Back A-frame support
      const aFrame = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.8, 0.03), woodMat);
      aFrame.rotation.x = -0.2;
      aFrame.position.set(0, 0.35, -0.15);
      easelGroup.add(aFrame);

      tableGroup.add(easelGroup);

      // Contact shadow plane directly beneath easel
      const shadowPlaneGeo = new THREE.PlaneGeometry(1.6, 0.8);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.35,
        depthWrite: false
      });
      const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.set(0, 0.731, 0);
      tableGroup.add(shadowPlane);
    }
  };

  /**
   * Updates lighting Kelvin and Spotlights
   */
  const updateLighting = () => {
    const spot = spotLightRef.current;
    const hemi = ambientLightRef.current;
    if (!spot || !hemi) return;

    const { config: currentConfig, artwork: currentArt } = propsRef.current;
    const kelvin = currentArt.recommendedLightTemp || 3200;
    const rgb = kelvinToRgb(kelvin);

    const lightColor = new THREE.Color(rgb.r / 255, rgb.g / 255, rgb.b / 255);
    spot.color.copy(lightColor);
    spot.intensity = currentConfig.lightIntensity * 2.2;

    // Angle positioning
    const rad = (currentConfig.lightAngle * Math.PI) / 180;
    spot.position.set(Math.sin(rad) * 1.2, 3.2, Math.cos(rad) * 2.4);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      role="region"
      aria-label="عرض ثلاثي الأبعاد تفاعلي للوحة الفنية"
      data-testid="three-canvas-container"
    />
  );
};
