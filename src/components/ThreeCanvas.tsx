import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { WoodOption } from '../types';

interface ThreeCanvasProps {
  alto: number; // in cm (e.g. 180)
  ancho: number; // in cm (e.g. 160)
  prof: number; // in cm (e.g. 40)
  shelves: number; // 2 to 7
  wood: WoodOption;
  isRotating: boolean;
  onToggleRotate: () => void;
  doorsOpen: boolean;
  onToggleDoors: () => void;
  wireframe: boolean;
  onToggleWireframe: () => void;
  cameraView: 'iso' | 'front' | 'top';
  fallbackImage: string;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  alto,
  ancho,
  prof,
  shelves,
  wood,
  isRotating,
  onToggleRotate,
  doorsOpen,
  onToggleDoors,
  wireframe,
  onToggleWireframe,
  cameraView,
  fallbackImage,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const furnitureGroupRef = useRef<THREE.Group | null>(null);
  const leftDoorRef = useRef<THREE.Group | null>(null);
  const rightDoorRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const [renderMode, setRenderMode] = useState<'3d' | 'photo'>('3d');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate Wood Texture procedurally on canvas
  const getWoodTexture = (baseColor: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, 512, 512);

      // Add wood grain stripes
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      for (let i = 0; i < 512; i += 4) {
        if (Math.sin(i * 0.1) > 0) {
          ctx.fillRect(0, i, 512, 2);
        }
      }
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      for (let i = 0; i < 512; i += 7) {
        ctx.fillRect(0, i, 512, 1);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  };

  // Setup Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container || renderMode !== '3d') return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf2ede4);

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(2.8, 2.2, 3.8);
    camera.lookAt(0, 0.8, 0);
    cameraRef.current = camera;

    // Renderer with soft shadow
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(4, 6, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x89bfd3, 0.6);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    // Ground plane with shadow
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid Floor
    const grid = new THREE.GridHelper(6, 24, 0x003745, 0xdcd7ca);
    grid.position.y = 0.001;
    scene.add(grid);

    // Main furniture group
    const furnitureGroup = new THREE.Group();
    scene.add(furnitureGroup);
    furnitureGroupRef.current = furnitureGroup;

    // Interaction handling (drag orbit)
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !furnitureGroupRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      furnitureGroupRef.current.rotation.y += dx * 0.01;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !furnitureGroupRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouseRef.current.x;
      furnitureGroupRef.current.rotation.y += dx * 0.01;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('touchstart', handleTouchStart);
    dom.addEventListener('touchmove', handleTouchMove);
    dom.addEventListener('touchend', handleTouchEnd);

    // Resize observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isRotating && furnitureGroupRef.current) {
        furnitureGroupRef.current.rotation.y += 0.01;
      }

      // Smooth door animation
      if (leftDoorRef.current && rightDoorRef.current) {
        const targetAngle = doorsOpen ? -Math.PI / 2.2 : 0;
        leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(
          leftDoorRef.current.rotation.y,
          targetAngle,
          0.08
        );
        rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(
          rightDoorRef.current.rotation.y,
          -targetAngle,
          0.08
        );
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('touchstart', handleTouchStart);
      dom.removeEventListener('touchmove', handleTouchMove);
      dom.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [renderMode]);

  // Update Geometry when parameters change
  useEffect(() => {
    const scene = sceneRef.current;
    const group = furnitureGroupRef.current;
    if (!scene || !group || renderMode !== '3d') return;

    // Clear old furniture meshes
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
    }

    // Convert cm to 3D world units (scale: 100cm = 1 unit)
    const h = alto / 100;
    const w = ancho / 100;
    const d = prof / 100;
    const thickness = 0.03; // 3cm board thickness

    const texture = getWoodTexture(wood.colorHex);
    const woodMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.55,
      metalness: 0.05,
      wireframe: wireframe,
    });

    const blackMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: wireframe,
    });

    // 1. Bottom plinth / Base board
    const bottomGeo = new THREE.BoxGeometry(w, thickness, d);
    const bottomMesh = new THREE.Mesh(bottomGeo, woodMaterial);
    bottomMesh.position.set(0, thickness / 2 + 0.05, 0);
    bottomMesh.castShadow = true;
    bottomMesh.receiveShadow = true;
    group.add(bottomMesh);

    // 2. Top roof board
    const topGeo = new THREE.BoxGeometry(w, thickness, d);
    const topMesh = new THREE.Mesh(topGeo, woodMaterial);
    topMesh.position.set(0, h - thickness / 2 + 0.05, 0);
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    group.add(topMesh);

    // 3. Left side panel
    const sideH = h - thickness * 2;
    const sideGeo = new THREE.BoxGeometry(thickness, sideH, d);
    const leftSide = new THREE.Mesh(sideGeo, woodMaterial);
    leftSide.position.set(-w / 2 + thickness / 2, sideH / 2 + thickness + 0.05, 0);
    leftSide.castShadow = true;
    leftSide.receiveShadow = true;
    group.add(leftSide);

    // 4. Right side panel
    const rightSide = new THREE.Mesh(sideGeo, woodMaterial);
    rightSide.position.set(w / 2 - thickness / 2, sideH / 2 + thickness + 0.05, 0);
    rightSide.castShadow = true;
    rightSide.receiveShadow = true;
    group.add(rightSide);

    // 5. Back panel (thinner)
    const backGeo = new THREE.BoxGeometry(w - thickness * 2, sideH, 0.01);
    const backMesh = new THREE.Mesh(backGeo, woodMaterial);
    backMesh.position.set(0, sideH / 2 + thickness + 0.05, -d / 2 + 0.005);
    backMesh.receiveShadow = true;
    group.add(backMesh);

    // 6. Center divider (if width is large enough)
    if (w > 1.2) {
      const centerDividerGeo = new THREE.BoxGeometry(thickness, sideH, d - 0.02);
      const centerDivider = new THREE.Mesh(centerDividerGeo, woodMaterial);
      centerDivider.position.set(0, sideH / 2 + thickness + 0.05, 0);
      centerDivider.castShadow = true;
      group.add(centerDivider);
    }

    // 7. Shelves (Baldas)
    const shelfSpacing = sideH / (shelves + 1);
    for (let i = 1; i <= shelves; i++) {
      const shelfY = thickness + 0.05 + i * shelfSpacing;
      const shelfGeo = new THREE.BoxGeometry(w - thickness * 2, thickness, d - 0.02);
      const shelfMesh = new THREE.Mesh(shelfGeo, woodMaterial);
      shelfMesh.position.set(0, shelfY, 0);
      shelfMesh.castShadow = true;
      shelfMesh.receiveShadow = true;
      group.add(shelfMesh);

      // Brass shelf pins detail
      const pinGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.015, 8);
      const pinMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
      const pinLeft = new THREE.Mesh(pinGeo, pinMat);
      pinLeft.position.set(-w / 2 + thickness + 0.008, shelfY - thickness / 2, d / 3);
      group.add(pinLeft);
      const pinRight = new THREE.Mesh(pinGeo, pinMat);
      pinRight.position.set(w / 2 - thickness - 0.008, shelfY - thickness / 2, d / 3);
      group.add(pinRight);
    }

    // 8. Lower Cabinet Doors (doorsOpen pivot animation)
    const doorH = Math.min(0.65, sideH * 0.4);
    const doorW = (w - thickness * 2) / 2;

    // Left door pivot
    const leftPivot = new THREE.Group();
    leftPivot.position.set(-w / 2 + thickness, thickness + 0.05, d / 2);
    const leftDoorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(doorW - 0.005, doorH, 0.02),
      woodMaterial
    );
    leftDoorMesh.position.set(doorW / 2, doorH / 2, 0);
    leftDoorMesh.castShadow = true;
    leftPivot.add(leftDoorMesh);

    // Door handle (black slim handle)
    const handleGeo = new THREE.BoxGeometry(0.015, 0.12, 0.02);
    const leftHandle = new THREE.Mesh(handleGeo, blackMetalMaterial);
    leftHandle.position.set(doorW - 0.04, doorH / 2, 0.015);
    leftPivot.add(leftHandle);

    group.add(leftPivot);
    leftDoorRef.current = leftPivot;

    // Right door pivot
    const rightPivot = new THREE.Group();
    rightPivot.position.set(w / 2 - thickness, thickness + 0.05, d / 2);
    const rightDoorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(doorW - 0.005, doorH, 0.02),
      woodMaterial
    );
    rightDoorMesh.position.set(-doorW / 2, doorH / 2, 0);
    rightDoorMesh.castShadow = true;
    rightPivot.add(rightDoorMesh);

    const rightHandle = new THREE.Mesh(handleGeo, blackMetalMaterial);
    rightHandle.position.set(-doorW + 0.04, doorH / 2, 0.015);
    rightPivot.add(rightHandle);

    group.add(rightPivot);
    rightDoorRef.current = rightPivot;

    // 9. Steel legs / plinth base
    const legGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.05, 12);
    const legPositions = [
      [-w / 2 + 0.06, 0.025, d / 2 - 0.06],
      [w / 2 - 0.06, 0.025, d / 2 - 0.06],
      [-w / 2 + 0.06, 0.025, -d / 2 + 0.06],
      [w / 2 - 0.06, 0.025, -d / 2 + 0.06],
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, blackMetalMaterial);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      group.add(leg);
    });

    // Center camera on object height
    if (cameraRef.current) {
      cameraRef.current.lookAt(0, h / 2, 0);
    }
  }, [alto, ancho, prof, shelves, wood, wireframe, renderMode]);

  // Handle camera view switch
  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    const h = alto / 100;
    if (cameraView === 'front') {
      camera.position.set(0, h / 2, 3.8);
      camera.lookAt(0, h / 2, 0);
    } else if (cameraView === 'top') {
      camera.position.set(0, 4.2, 0.1);
      camera.lookAt(0, 0, 0);
    } else {
      // Iso view
      camera.position.set(2.8, 2.2, 3.8);
      camera.lookAt(0, h / 2, 0);
    }
  }, [cameraView, alto]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`relative w-full aspect-[4/3] md:aspect-[16/11] bg-[#f0eee8] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : ''
      }`}
    >
      {/* Background blueprint marks */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundSize: '32px 32px',
          backgroundImage: 'radial-gradient(#70787c 1px, transparent 1px)',
        }}
      />

      {/* Top Left Viewport Stats HUD */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#ffffff]/90 backdrop-blur-md shadow-sm">
          <span className="material-symbols-outlined text-[#003745] text-[16px]">view_in_ar</span>
          <span className="font-headline text-[11px] text-[#003745] font-bold">
            {renderMode === '3d' ? 'WEBGL 3D PARAMÉTRICO VIVO' : 'RENDER FOTORREALISTA'}
          </span>
        </div>
        <span className="font-headline text-[10px] text-[#566B72] px-1">
          Escala 1:10 • Tolerancia CNC: ±1.5mm
        </span>
      </div>

      {/* Top Right AR and Render Toggle */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setRenderMode(renderMode === '3d' ? 'photo' : '3d')}
          className="p-2 rounded-lg bg-[#ffffff]/90 hover:bg-white backdrop-blur-md text-[#003745] shadow-sm transition-colors flex items-center gap-1 font-headline text-[12px] font-semibold cursor-pointer"
          title="Alternar entre 3D interactivo y Foto Render"
        >
          <span className="material-symbols-outlined text-[18px]">
            {renderMode === '3d' ? 'photo_camera' : '3d_rotation'}
          </span>
          <span className="hidden sm:inline">{renderMode === '3d' ? 'Foto Render' : 'Visor 3D'}</span>
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-[#ffffff]/90 hover:bg-white backdrop-blur-md text-[#003745] shadow-sm transition-colors cursor-pointer"
          title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
          </span>
        </button>
      </div>

      {/* 3D Canvas Mount Point */}
      {renderMode === '3d' ? (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        <div className="relative w-full h-full flex items-center justify-center p-6">
          <img
            src={fallbackImage}
            alt="Render Fotorrealista de mueble"
            className="max-h-full max-w-full object-contain rounded-xl shadow-xl transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}

      {/* Dynamic Dimension Cotas Overlay (Live Architectural Measurement Lines) */}
      <div className="pointer-events-none absolute inset-0">
        {/* Height Cota (Left) */}
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex items-center gap-1.5 select-none">
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-[14px] text-[#683f00] -mb-1">
              arrow_drop_up
            </span>
            <div className="w-px h-32 md:h-44 bg-[#683f00]/70" />
            <span className="material-symbols-outlined text-[14px] text-[#683f00] -mt-1">
              arrow_drop_down
            </span>
          </div>
          <div className="px-2 py-0.5 rounded bg-white/95 shadow-sm text-[#003745] font-headline text-[12px] font-bold border border-[#DCD7CA] whitespace-nowrap">
            Alto: {alto} cm
          </div>
        </div>

        {/* Width Cota (Bottom) */}
        <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 select-none">
          <div className="px-2 py-0.5 rounded bg-white/95 shadow-sm text-[#003745] font-headline text-[12px] font-bold border border-[#DCD7CA] whitespace-nowrap">
            Ancho: {ancho} cm
          </div>
          <div className="flex items-center">
            <span className="material-symbols-outlined text-[14px] text-[#683f00] -mr-1">
              arrow_left
            </span>
            <div className="h-px w-36 sm:w-56 md:w-64 bg-[#683f00]/70" />
            <span className="material-symbols-outlined text-[14px] text-[#683f00] -ml-1">
              arrow_right
            </span>
          </div>
        </div>

        {/* Depth Cota (Right) */}
        <div className="absolute right-4 md:right-8 top-1/3 flex items-center gap-1 select-none">
          <div className="px-2 py-1 rounded bg-white/95 shadow-sm text-[#003745] font-headline text-[12px] font-bold border border-[#DCD7CA] flex items-center gap-1">
            <span className="material-symbols-outlined text-[#566B72] text-[14px]">
              open_in_full
            </span>
            Fondo: {prof} cm
          </div>
        </div>
      </div>

      {/* Drag instruction badge */}
      <div className="absolute top-14 left-4 pointer-events-none hidden md:flex items-center gap-1 text-[11px] text-[#566B72] bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded shadow-xs">
        <span className="material-symbols-outlined text-[14px]">touch_app</span>
        <span>Arrastra para rotar en 3D</span>
      </div>
    </div>
  );
};
