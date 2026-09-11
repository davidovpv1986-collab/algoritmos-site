"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Живая 3D-сцена в лагунной палитре: стеклянный тор-узел,
 * металлическое ядро и облако частиц. Медленное вращение,
 * параллакс за указателем, пауза в неактивной вкладке,
 * сокращение движения при prefers-reduced-motion,
 * статичный CSS-постер при отсутствии WebGL.
 */
export default function OrbitScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: isMobile ? "low-power" : "high-performance",
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.8));
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    root.rotation.set(-0.12, 0.25, -0.08);
    scene.add(root);

    const knotGeometry = new THREE.TorusKnotGeometry(
      2.65,
      0.62,
      isMobile ? 140 : 280,
      isMobile ? 28 : 52,
      2,
      3,
    );
    const knotMaterial = new THREE.MeshPhysicalMaterial({
      color: "#2E7F86",
      emissive: new THREE.Color("#17918E"),
      emissiveIntensity: 0.22,
      metalness: 0.38,
      roughness: 0.24,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
    });
    const knot = new THREE.Mesh(knotGeometry, knotMaterial);
    root.add(knot);

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: "#6BA8AB",
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const wire = new THREE.Mesh(knotGeometry, wireMaterial);
    wire.scale.setScalar(1.012);
    root.add(wire);

    const coreGeometry = new THREE.IcosahedronGeometry(1.04, 5);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: "#8FC4BE",
      emissive: new THREE.Color("#2DA8A4"),
      emissiveIntensity: 0.12,
      metalness: 0.82,
      roughness: 0.16,
      clearcoat: 1,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    root.add(core);

    const pointsCount = isMobile ? 160 : 420;
    const pointsPositions = new Float32Array(pointsCount * 3);
    for (let index = 0; index < pointsCount; index += 1) {
      const radius = 3.6 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      pointsPositions[index * 3] = Math.cos(angle) * radius;
      pointsPositions[index * 3 + 1] = (Math.random() - 0.5) * 5.4;
      pointsPositions[index * 3 + 2] = Math.sin(angle) * radius * 0.48;
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(pointsPositions, 3),
    );
    const pointsMaterial = new THREE.PointsMaterial({
      color: "#7FD0C8",
      size: 0.028,
      transparent: true,
      opacity: 0.34,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    root.add(points);

    scene.add(new THREE.AmbientLight("#6BA8AB", 1.1));

    const keyLight = new THREE.PointLight("#2DA8A4", 42, 24);
    keyLight.position.set(4.5, 4, 6);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight("#105764", 34, 22);
    fillLight.position.set(-4.5, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight("#CCE1D3", 26, 18);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const updatePointer = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.72;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.48;
    };
    const resetPointer = () => {
      target.x = 0;
      target.y = 0;
    };

    mount.addEventListener("pointermove", updatePointer);
    mount.addEventListener("pointerleave", resetPointer);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    let running = true;

    const animate = () => {
      frame = 0;
      if (!running) return;

      const elapsed = clock.getElapsedTime();
      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;

      root.rotation.y = 0.25 + pointer.x + (reducedMotion ? 0 : elapsed * 0.055);
      root.rotation.x = -0.12 + pointer.y;
      root.position.y = reducedMotion ? 0 : Math.sin(elapsed * 0.5) * 0.08;
      core.rotation.x = reducedMotion ? 0 : elapsed * 0.11;
      core.rotation.y = reducedMotion ? 0 : -elapsed * 0.16;
      points.rotation.z = reducedMotion ? 0 : elapsed * 0.018;

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    const start = () => {
      if (!frame && running) {
        clock.getDelta();
        frame = window.requestAnimationFrame(animate);
      }
    };
    const stop = () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    /* Пауза рендера в неактивной вкладке — экономим батарею и GPU */
    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    /* Пауза, когда сцена ушла с экрана — экономим батарею на телефоне */
    const onIntersect: IntersectionObserverCallback = ([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting && !document.hidden) {
        start();
      } else {
        stop();
      }
    };
    const intersection = new IntersectionObserver(onIntersect, { threshold: 0.08 });
    intersection.observe(mount);

    start();

    return () => {
      running = false;
      stop();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver.disconnect();
      mount.removeEventListener("pointermove", updatePointer);
      mount.removeEventListener("pointerleave", resetPointer);
      knotGeometry.dispose();
      knotMaterial.dispose();
      wireMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (webglFailed) {
    /* Статичный постер, если WebGL недоступен */
    return (
      <div
        className="absolute inset-0"
        role="img"
        aria-label="Абстрактная трёхмерная орбита — символ системного подхода Алгоритмос"
      >
        <div className="absolute left-1/2 top-1/2 aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#8FC4BE_0%,#2DA8A4_28%,#0B2E3D_68%,transparent_72%)] opacity-80 blur-[1px]" />
        <div className="absolute left-1/2 top-1/2 aspect-square w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-aqua/30 [transform:translate(-50%,-50%)_rotateX(66deg)]" />
        <div className="absolute left-1/2 top-1/2 aspect-square w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/25 [transform:translate(-50%,-50%)_rotateX(74deg)]" />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      role="img"
      aria-label="Абстрактная трёхмерная орбита — символ системного подхода Алгоритмос"
    />
  );
}
