import * as THREE from 'three';

type Options = { mode: 'hero' | 'map' };
type ThemePalette = {
  line: THREE.Color;
  strongLine: THREE.Color;
  core: THREE.Color;
  node: THREE.Color;
  particle: THREE.Color;
  lineOpacity: number;
  strongOpacity: number;
  coreOpacity: number;
  nodeOpacity: number;
  particleOpacity: number;
};

type NodeRecord = {
  mesh: THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial>;
  radiusX: number;
  radiusY: number;
  angle: number;
  speed: number;
  phase: number;
};

type PulseRecord = {
  mesh: THREE.LineLoop;
  material: THREE.LineBasicMaterial;
  createdAt: number;
};

function seededRandom(seed = 42) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function paletteFromTheme(): ThemePalette {
  const dark = document.documentElement.dataset.theme === 'dark';
  return {
    line: new THREE.Color(dark ? 0xffffff : 0x000000),
    strongLine: new THREE.Color(dark ? 0xffffff : 0x000000),
    core: new THREE.Color(dark ? 0xffffff : 0x000000),
    node: new THREE.Color(dark ? 0xffffff : 0x000000),
    particle: new THREE.Color(dark ? 0xffffff : 0x000000),
    lineOpacity: dark ? 0.2 : 0.18,
    strongOpacity: dark ? 0.42 : 0.38,
    coreOpacity: dark ? 0.35 : 0.34,
    nodeOpacity: dark ? 0.78 : 0.75,
    particleOpacity: dark ? 0.16 : 0.12
  };
}

function createLineMaterial(opacity: number, dashed = false) {
  if (dashed) {
    return new THREE.LineDashedMaterial({
      color: 0x000000,
      transparent: true,
      opacity,
      dashSize: 0.12,
      gapSize: 0.09
    });
  }

  return new THREE.LineBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity
  });
}

function makeArcGeometry(radiusX: number, radiusY: number, start: number, end: number, segments = 180) {
  const points: THREE.Vector3[] = [];
  const span = end - start;
  for (let index = 0; index <= segments; index += 1) {
    const angle = start + (span * index) / segments;
    points.push(new THREE.Vector3(Math.cos(angle) * radiusX, Math.sin(angle) * radiusY, 0));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

function makeEllipseLoop(radiusX: number, radiusY: number, segments = 160) {
  return makeArcGeometry(radiusX, radiusY, 0, Math.PI * 2, segments);
}

function addWireSphere({
  group,
  radius,
  isMobile,
  materials,
  geometries
}: {
  group: THREE.Group;
  radius: number;
  isMobile: boolean;
  materials: THREE.Material[];
  geometries: THREE.BufferGeometry[];
}) {
  const sphereGroup = new THREE.Group();
  const lineMaterial = createLineMaterial(0.34);
  materials.push(lineMaterial);
  const latCount = isMobile ? 9 : 13;
  const longCount = isMobile ? 8 : 11;

  for (let index = 1; index < latCount; index += 1) {
    const t = -1 + (2 * index) / latCount;
    const y = t * radius;
    const ringRadius = Math.sqrt(Math.max(radius * radius - y * y, 0.001));
    const geometry = makeEllipseLoop(ringRadius, ringRadius, 144);
    const line = new THREE.LineLoop(geometry, lineMaterial);
    line.position.y = y;
    line.rotation.x = Math.PI / 2;
    geometries.push(geometry);
    sphereGroup.add(line);
  }

  for (let index = 0; index < longCount; index += 1) {
    const geometry = makeEllipseLoop(radius, radius, 160);
    const line = new THREE.LineLoop(geometry, lineMaterial);
    line.rotation.y = (index / longCount) * Math.PI;
    geometries.push(geometry);
    sphereGroup.add(line);
  }

  const equatorGeometry = makeEllipseLoop(radius, radius, 180);
  const equator = new THREE.LineLoop(equatorGeometry, lineMaterial);
  geometries.push(equatorGeometry);
  sphereGroup.add(equator);
  group.add(sphereGroup);
  return sphereGroup;
}

export function createOrbitalSystem(canvas: HTMLCanvasElement, options: Options) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 720px)').matches;
  const random = seededRandom(options.mode === 'map' ? 112 : 72);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, -20, 20);
  camera.position.set(0, 0, 10);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: false });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const mainGroup = new THREE.Group();
  mainGroup.scale.setScalar(options.mode === 'hero' ? (isMobile ? 0.72 : 1.02) : 0.85);
  mainGroup.position.set(options.mode === 'hero' ? (isMobile ? 0 : -0.38) : 0, options.mode === 'hero' && isMobile ? -0.35 : 0, 0);
  scene.add(mainGroup);

  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const lineMaterials: Array<THREE.LineBasicMaterial | THREE.LineDashedMaterial> = [];
  const nodeMaterials: THREE.MeshBasicMaterial[] = [];
  const connectionMaterials: THREE.LineBasicMaterial[] = [];

  const sphereGroup = addWireSphere({
    group: mainGroup,
    radius: options.mode === 'hero' ? 0.9 : 0.62,
    isMobile,
    materials,
    geometries
  });

  const glowGeometry = new THREE.CircleGeometry(options.mode === 'hero' ? 1.05 : 0.72, 96);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.z = -0.08;
  geometries.push(glowGeometry);
  materials.push(glowMaterial);
  mainGroup.add(glow);

  const orbitPlane = new THREE.Group();
  orbitPlane.rotation.x = -0.45;
  orbitPlane.rotation.z = 0.25;
  mainGroup.add(orbitPlane);

  const orbitGroup = new THREE.Group();
  const nodesGroup = new THREE.Group();
  const connectionGroup = new THREE.Group();
  const particlesGroup = new THREE.Group();
  orbitPlane.add(orbitGroup, connectionGroup, nodesGroup, particlesGroup);

  const orbitCount = options.mode === 'map' ? 9 : isMobile ? 10 : 16;
  const orbitRecords: Array<{ radiusX: number; radiusY: number; angle: number }> = [];

  for (let index = 0; index < orbitCount; index += 1) {
    const ratio = index / Math.max(orbitCount - 1, 1);
    const radiusX = THREE.MathUtils.lerp(1.35, isMobile ? 4.25 : 5.55, Math.pow(ratio, 0.9));
    const radiusY = THREE.MathUtils.lerp(0.45, isMobile ? 1.55 : 2.02, Math.pow(ratio, 1.08));
    const angle = THREE.MathUtils.degToRad(THREE.MathUtils.lerp(-6, 8, random()));
    const start = random() > 0.42 ? THREE.MathUtils.lerp(0, Math.PI * 0.38, random()) : 0;
    const visibleSpan = THREE.MathUtils.lerp(Math.PI * 1.25, Math.PI * 1.92, random());
    const full = random() > 0.48;
    const geometry = full ? makeEllipseLoop(radiusX, radiusY, 220) : makeArcGeometry(radiusX, radiusY, start, start + visibleSpan, 180);
    const dashed = index % 4 === 1 || index % 7 === 3;
    const material = createLineMaterial(THREE.MathUtils.lerp(0.18, 0.42, 1 - ratio * 0.62), dashed);
    const line = full ? new THREE.LineLoop(geometry, material) : new THREE.Line(geometry, material);
    line.rotation.z = angle;
    if (material instanceof THREE.LineDashedMaterial) line.computeLineDistances();
    orbitRecords.push({ radiusX, radiusY, angle });
    geometries.push(geometry);
    materials.push(material);
    lineMaterials.push(material);
    orbitGroup.add(line);
  }

  const nodeCount = options.mode === 'map' ? 24 : isMobile ? 28 : 46;
  const nodes: NodeRecord[] = [];
  const nodeGeometrySmall = new THREE.CircleGeometry(0.022, 18);
  const nodeGeometryLarge = new THREE.CircleGeometry(0.04, 22);
  geometries.push(nodeGeometrySmall, nodeGeometryLarge);

  for (let index = 0; index < nodeCount; index += 1) {
    const orbit = orbitRecords[Math.floor(random() * orbitRecords.length)];
    const larger = random() > 0.82;
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: larger ? 0.78 : 0.58,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(larger ? nodeGeometryLarge : nodeGeometrySmall, material);
    const phase = random() * Math.PI * 2;
    const speed = THREE.MathUtils.lerp(0.00018, 0.00055, random()) * (random() > 0.5 ? 1 : -1);
    nodes.push({ mesh, radiusX: orbit.radiusX, radiusY: orbit.radiusY, angle: orbit.angle, speed, phase });
    materials.push(material);
    nodeMaterials.push(material);
    nodesGroup.add(mesh);
  }

  const connectionCount = options.mode === 'map' ? 8 : isMobile ? 8 : 14;
  const connectionRecords: Array<{ a: NodeRecord; b: NodeRecord; geometry: THREE.BufferGeometry }> = [];
  for (let index = 0; index < connectionCount; index += 1) {
    const a = nodes[Math.floor(random() * nodes.length)];
    const b = nodes[Math.floor(random() * nodes.length)];
    if (!a || !b || a === b) continue;
    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const material = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.08 });
    const line = new THREE.Line(geometry, material);
    geometries.push(geometry);
    materials.push(material);
    connectionMaterials.push(material);
    connectionRecords.push({ a, b, geometry });
    connectionGroup.add(line);
  }

  const particleCount = options.mode === 'map' ? 48 : isMobile ? 70 : 110;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let index = 0; index < particleCount; index += 1) {
    const radius = THREE.MathUtils.lerp(0.55, 1.45, Math.pow(random(), 0.65));
    const angle = random() * Math.PI * 2;
    particlePositions[index * 3] = Math.cos(angle) * radius;
    particlePositions[index * 3 + 1] = Math.sin(angle) * radius * THREE.MathUtils.lerp(0.34, 0.74, random());
    particlePositions[index * 3 + 2] = THREE.MathUtils.lerp(-0.06, 0.06, random());
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x000000,
    size: options.mode === 'hero' ? 0.014 : 0.018,
    transparent: true,
    opacity: 0.1,
    depthWrite: false
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  geometries.push(particleGeometry);
  materials.push(particleMaterial);
  particlesGroup.add(particles);

  const pointer = new THREE.Vector2();
  const targetRotation = new THREE.Vector2();
  const projectedNode = new THREE.Vector3();
  const clickPoint = new THREE.Vector3();
  const pulses: PulseRecord[] = [];
  let hoveredNode: NodeRecord | undefined;

  const setHoveredNode = (next?: NodeRecord) => {
    if (hoveredNode === next) return;
    if (hoveredNode) {
      hoveredNode.mesh.scale.setScalar(1);
      hoveredNode.mesh.material.opacity = 0.62;
    }
    hoveredNode = next;
    if (hoveredNode) {
      hoveredNode.mesh.scale.setScalar(1.9);
      hoveredNode.mesh.material.opacity = 0.95;
    }
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
  };

  const pickNode = () => {
    let nearest: NodeRecord | undefined;
    let nearestDistance = 0.09;
    nodes.forEach((node) => {
      node.mesh.getWorldPosition(projectedNode);
      projectedNode.project(camera);
      const distance = Math.hypot(projectedNode.x - pointer.x, projectedNode.y - pointer.y);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = node;
      }
    });
    setHoveredNode(nearest);
  };

  const createPulse = (position: THREE.Vector3, radius = 0.11) => {
    const geometry = makeEllipseLoop(radius, radius, 80);
    const material = new THREE.LineBasicMaterial({
      color: paletteFromTheme().node,
      transparent: true,
      opacity: 0.34
    });
    const pulse = new THREE.LineLoop(geometry, material);
    pulse.position.copy(position);
    orbitPlane.add(pulse);
    geometries.push(geometry);
    materials.push(material);
    pulses.push({ mesh: pulse, material, createdAt: performance.now() });
  };

  const updatePointerFromEvent = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!inside) {
      setHoveredNode();
      canvas.style.cursor = 'default';
      return false;
    }

    pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
    pointer.y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    return true;
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!updatePointerFromEvent(event)) return;
    targetRotation.x = pointer.y * 0.065;
    targetRotation.y = pointer.x * 0.065;
    if (!isMobile) pickNode();
  };

  const onPointerLeave = () => setHoveredNode();

  const onClick = (event: PointerEvent) => {
    if (isMobile) return;
    if (!updatePointerFromEvent(event)) return;
    if (hoveredNode) {
      createPulse(hoveredNode.mesh.position, 0.12);
      targetRotation.x += 0.018;
      targetRotation.y -= 0.018;
      return;
    }
    clickPoint.set(pointer.x, pointer.y, 0).unproject(camera);
    orbitPlane.worldToLocal(clickPoint);
    createPulse(clickPoint, 0.085);
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('click', onClick);

  const syncTheme = () => {
    const palette = paletteFromTheme();
    lineMaterials.forEach((material, index) => {
      const ratio = index / Math.max(lineMaterials.length - 1, 1);
      material.color.copy(ratio < 0.32 ? palette.strongLine : palette.line);
      material.opacity = THREE.MathUtils.lerp(palette.strongOpacity, palette.lineOpacity, ratio);
    });
    const sphereMaterial = materials[0] as THREE.LineBasicMaterial;
    sphereMaterial.color.copy(palette.core);
    sphereMaterial.opacity = palette.coreOpacity;
    nodeMaterials.forEach((material) => {
      material.color.copy(palette.node);
      material.opacity = palette.nodeOpacity;
    });
    connectionMaterials.forEach((material) => {
      material.color.copy(palette.line);
      material.opacity = palette.lineOpacity * 0.42;
    });
    particleMaterial.color.copy(palette.particle);
    particleMaterial.opacity = palette.particleOpacity;
    glowMaterial.color.copy(palette.core);
    glowMaterial.opacity = document.documentElement.dataset.theme === 'dark' ? 0.1 : 0;
    pulses.forEach((pulse) => pulse.material.color.copy(palette.node));
  };
  syncTheme();
  window.addEventListener('themechange', syncTheme);

  const updateNodes = (time = 0) => {
    nodes.forEach((node) => {
      const angle = node.phase + time * node.speed;
      const x = Math.cos(angle) * node.radiusX;
      const y = Math.sin(angle) * node.radiusY;
      const cos = Math.cos(node.angle);
      const sin = Math.sin(node.angle);
      node.mesh.position.set(x * cos - y * sin, x * sin + y * cos, 0.02);
    });

    connectionRecords.forEach((record) => {
      const attr = record.geometry.getAttribute('position') as THREE.BufferAttribute;
      attr.setXYZ(0, record.a.mesh.position.x, record.a.mesh.position.y, record.a.mesh.position.z);
      attr.setXYZ(1, record.b.mesh.position.x, record.b.mesh.position.y, record.b.mesh.position.z);
      attr.needsUpdate = true;
    });
  };
  updateNodes();

  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    const aspect = width / Math.max(height, 1);
    const viewHeight = options.mode === 'hero' ? (isMobile ? 6.2 : 6.4) : 7.5;
    camera.left = (-viewHeight * aspect) / 2;
    camera.right = (viewHeight * aspect) / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
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
      const time = performance.now();
      mainGroup.rotation.x += (targetRotation.x - mainGroup.rotation.x) * 0.035;
      mainGroup.rotation.y += (targetRotation.y - mainGroup.rotation.y) * 0.035;
      sphereGroup.rotation.y += 0.001;
      particlesGroup.rotation.z -= 0.00035;
      updateNodes(time);
      for (let index = pulses.length - 1; index >= 0; index -= 1) {
        const pulse = pulses[index];
        const age = (time - pulse.createdAt) / 900;
        if (age >= 1) {
          orbitPlane.remove(pulse.mesh);
          pulses.splice(index, 1);
          continue;
        }
        pulse.mesh.scale.setScalar(1 + age * 3.4);
        pulse.material.opacity = (1 - age) * 0.32;
      }
    }
    renderer.render(scene, camera);
  };
  animate();

  return {
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
      window.removeEventListener('themechange', syncTheme);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    }
  };
}
