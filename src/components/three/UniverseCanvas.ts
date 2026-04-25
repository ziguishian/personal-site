import * as THREE from 'three';

type Options = { mode: 'hero' | 'map' };

function createMarsTexture() {
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 512;
  textureCanvas.height = 256;
  const ctx = textureCanvas.getContext('2d');
  if (!ctx) return undefined;

  const gradient = ctx.createLinearGradient(0, 0, 512, 256);
  gradient.addColorStop(0, '#6b2d1e');
  gradient.addColorStop(0.38, '#b75e37');
  gradient.addColorStop(0.72, '#8a3e27');
  gradient.addColorStop(1, '#3a1712');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 256);

  for (let i = 0; i < 420; i += 1) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const radius = THREE.MathUtils.randFloat(1.5, 11);
    const alpha = THREE.MathUtils.randFloat(0.035, 0.14);
    ctx.fillStyle = `rgba(${THREE.MathUtils.randInt(70, 135)}, ${THREE.MathUtils.randInt(28, 65)}, ${THREE.MathUtils.randInt(20, 44)}, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y, radius * THREE.MathUtils.randFloat(1.4, 4.2), radius, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 22; i += 1) {
    const y = THREE.MathUtils.randFloat(58, 198);
    ctx.strokeStyle = `rgba(55, 20, 16, ${THREE.MathUtils.randFloat(0.1, 0.2)})`;
    ctx.lineWidth = THREE.MathUtils.randFloat(0.8, 2.2);
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 28) {
      ctx.lineTo(x, y + Math.sin(x * 0.018 + i) * THREE.MathUtils.randFloat(3, 12));
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function createStarTexture() {
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 64;
  textureCanvas.height = 64;
  const ctx = textureCanvas.getContext('2d');
  if (!ctx) return undefined;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.22, 'rgba(255, 255, 255, 0.85)');
  gradient.addColorStop(0.58, 'rgba(255, 255, 255, 0.24)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createUniverseCanvas(canvas: HTMLCanvasElement, options: Options) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 720px)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, options.mode === 'map' ? 13 : 12.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: false });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

  const group = new THREE.Group();
  if (options.mode === 'hero') {
    group.scale.setScalar(0.96);
    group.position.set(isMobile ? 0 : 2.35, isMobile ? -1.7 : -0.25, 0);
  }
  scene.add(group);

  const marsTexture = createMarsTexture();
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(options.mode === 'map' ? 0.55 : 0.98, 64, 64),
    new THREE.MeshStandardMaterial({
      map: marsTexture,
      color: 0xb65b35,
      roughness: 0.82,
      metalness: 0.03,
      emissive: 0x180704,
      emissiveIntensity: 0.05
    })
  );
  group.add(sphere);

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(options.mode === 'map' ? 0.64 : 1.12, 64, 64),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: options.mode === 'map' ? 0.05 : 0.075,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  group.add(halo);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  const key = new THREE.DirectionalLight(0xffd5b0, 4.8);
  const rim = new THREE.PointLight(0x9fbaff, 2.8, 28);
  const lowerGlow = new THREE.PointLight(0xff8b5f, 0.8, 18);
  key.position.set(-4.5, 4.8, 5.8);
  rim.position.set(3.8, -1.6, 4.5);
  lowerGlow.position.set(-1.8, -3.2, 3.5);
  scene.add(ambient, key, rim, lowerGlow);

  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xdfe8ff, transparent: true, opacity: options.mode === 'hero' ? 0.2 : 0.18 });
  const orbitLines: THREE.LineLoop[] = [];
  const ringCount = options.mode === 'map' ? 7 : 16;
  for (let i = 0; i < ringCount; i += 1) {
    const radius = options.mode === 'map' ? 1.7 + i * 0.55 : 1.48 + i * 0.19;
    const curve = new THREE.EllipseCurve(0, 0, radius * 1.72, radius, 0, Math.PI * 2);
    const points = curve.getPoints(220);
    const geometry = new THREE.BufferGeometry().setFromPoints(points.map((point) => new THREE.Vector3(point.x, point.y, 0)));
    const line = new THREE.LineLoop(geometry, orbitMaterial.clone());
    line.rotation.x = 1.08;
    line.rotation.y = 0.36;
    line.rotation.z = -0.28;
    orbitLines.push(line);
    group.add(line);
  }

  const particleCount = options.mode === 'map' ? (isMobile ? 120 : 260) : isMobile ? 1250 : 3200;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i += 1) {
    const isDustDisk = options.mode === 'hero' && Math.random() < 0.2;
    if (isDustDisk) {
      const r = THREE.MathUtils.randFloat(1.65, 5.7);
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r * THREE.MathUtils.randFloat(1.05, 1.72);
      positions[i * 3 + 1] = Math.sin(a) * r * THREE.MathUtils.randFloat(0.18, 0.36);
      positions[i * 3 + 2] = THREE.MathUtils.randFloat(-0.24, 0.24);
    } else {
      const radius = THREE.MathUtils.randFloat(options.mode === 'map' ? 3 : 5.2, options.mode === 'map' ? 8 : 22);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.cos(phi) * radius * 0.72;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
    }

    const warmth = Math.random();
    const brightness = Math.random() > 0.9 ? 1 : THREE.MathUtils.randFloat(0.26, 0.72);
    const color = new THREE.Color(warmth > 0.78 ? 0xffddbf : warmth < 0.18 ? 0xbfd7ff : 0xffffff);
    color.multiplyScalar(brightness);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  const particleGeometry = new THREE.BufferGeometry();
  const starTexture = createStarTexture();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    map: starTexture,
    size: options.mode === 'map' ? 0.035 : 0.026,
    transparent: true,
    opacity: 0.9,
    vertexColors: true,
    sizeAttenuation: true,
    depthWrite: false,
    alphaTest: 0.02
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  particles.rotation.x = options.mode === 'map' ? 1.12 : 0.36;
  particles.rotation.y = options.mode === 'map' ? 0.42 : -0.24;
  group.add(particles);

  const nodes: THREE.Mesh[] = [];
  if (options.mode === 'map') {
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const labels = ['Works', 'Thinking', 'Live', 'About', 'Lab', 'System', 'Manifesto'];
    labels.forEach((_, index) => {
      const angle = (index / labels.length) * Math.PI * 2;
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.08, 20, 20), nodeMaterial.clone());
      node.position.set(Math.cos(angle) * 4.2, Math.sin(angle) * 2.35, THREE.MathUtils.randFloat(-0.8, 0.8));
      nodes.push(node);
      group.add(node);
    });
  }

  const pointer = new THREE.Vector2();
  const onPointer = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  const syncTheme = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    const color = dark ? 0xdfe8ff : 0x111111;
    const sphereMaterial = sphere.material as THREE.MeshStandardMaterial;
    sphereMaterial.color.setHex(dark ? 0xc56a42 : 0x9c4b2f);
    sphereMaterial.emissive.setHex(dark ? 0x1f0905 : 0x100403);
    sphereMaterial.emissiveIntensity = dark ? 0.06 : 0.025;
    sphereMaterial.metalness = 0.03;
    sphereMaterial.roughness = 0.82;
    (halo.material as THREE.MeshBasicMaterial).color.setHex(dark ? 0xff9f6f : 0x5b2418);
    (halo.material as THREE.MeshBasicMaterial).opacity = dark ? 0.075 : 0.035;
    orbitMaterial.color.setHex(color);
    orbitMaterial.opacity = options.mode === 'hero' ? (dark ? 0.34 : 0.18) : dark ? 0.5 : 0.28;
    group.children.forEach((child) => {
      if (child instanceof THREE.Line && child.material instanceof THREE.LineBasicMaterial) {
        child.material.color.setHex(color);
        child.material.opacity = options.mode === 'hero' ? (dark ? 0.34 : 0.18) : dark ? 0.5 : 0.28;
      }
    });
    particleMaterial.color.setHex(dark ? 0xffffff : 0x1f2933);
    particleMaterial.opacity = dark ? 0.9 : 0.62;
    particleMaterial.size = options.mode === 'map' ? (dark ? 0.045 : 0.035) : dark ? 0.024 : 0.02;
    nodes.forEach((node) => (node.material as THREE.MeshBasicMaterial).color.setHex(color));
  };
  syncTheme();
  window.addEventListener('themechange', syncTheme);

  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  resize();
  window.addEventListener('resize', resize);

  let frame = 0;
  let disposed = false;
  const animate = () => {
    if (disposed) return;
    frame = requestAnimationFrame(animate);
    if (!prefersReduced) {
      group.rotation.x += (pointer.y * 0.08 - group.rotation.x) * 0.025;
      group.rotation.y += (pointer.x * 0.08 - group.rotation.y) * 0.025;
      sphere.position.y = Math.sin(performance.now() * 0.0008) * 0.08;
      halo.position.y = sphere.position.y;
      sphere.rotation.y += 0.0014;
      halo.rotation.y -= 0.0004;
      particles.rotation.z += options.mode === 'map' ? 0.0012 : 0.00055;
      orbitLines.forEach((line, index) => {
    line.rotation.z += 0.00032 + index * 0.000006;
      });
    }
    renderer.render(scene, camera);
  };
  animate();

  return {
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('themechange', syncTheme);
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      (halo.geometry as THREE.BufferGeometry).dispose();
      (halo.material as THREE.Material).dispose();
      marsTexture?.dispose();
      starTexture?.dispose();
    }
  };
}
