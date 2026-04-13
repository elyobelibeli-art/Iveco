import React from 'react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { smoothLerp } from '../utils/animation';

const COLORS = {
  structural: 0x3b82f6,
  reusable: 0x16a34a,
  removable: 0xf97316,
  highlight: 0xfde047,
  qr: 0xe5e7eb,
};

function createModule({ x, color, name }) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.28, 0.28),
    new THREE.MeshStandardMaterial({ color }),
  );
  mesh.position.set(x, 0, 0);
  mesh.userData.partName = name;
  return mesh;
}

function createBolt(x, y) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.08, 20),
    new THREE.MeshStandardMaterial({ color: COLORS.removable }),
  );
  mesh.rotation.z = Math.PI / 2;
  mesh.position.set(x, y, 0.11);
  mesh.userData.partName = 'bolt';
  return mesh;
}

function createHoles(sideX) {
  const group = new THREE.Group();
  [-0.06, 0, 0.06].forEach((yPos) => {
    const hole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.02, 16),
      new THREE.MeshStandardMaterial({ color: 0x111827 }),
    );
    hole.rotation.x = Math.PI / 2;
    hole.position.set(sideX, yPos, 0.11);
    group.add(hole);
  });
  return group;
}

export default function ReFrameModel({ exploded, moduleState, onOpenPassport }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ exploded, moduleState });

  useEffect(() => {
    stateRef.current = { exploded, moduleState };
  }, [exploded, moduleState]);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(1.8, 1.2, 2.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const directional = new THREE.DirectionalLight(0xffffff, 1.2);
    directional.position.set(3, 4, 3);
    scene.add(directional);

    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.2, 0.2),
      new THREE.MeshStandardMaterial({ color: COLORS.structural }),
    );
    beam.userData.partName = 'beam';
    scene.add(beam);

    const leftModule = createModule({ x: -0.25, color: COLORS.reusable, name: 'left-module' });
    const rightModule = createModule({ x: 0.25, color: COLORS.reusable, name: 'right-module' });
    scene.add(leftModule, rightModule);

    const bolts = [createBolt(-0.15, 0.08), createBolt(-0.15, -0.08), createBolt(0.15, 0.08), createBolt(0.15, -0.08)];
    bolts.forEach((bolt) => scene.add(bolt));

    scene.add(createHoles(-0.22), createHoles(0.22));

    const passportTag = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.09, 0.01),
      new THREE.MeshStandardMaterial({ color: COLORS.qr }),
    );
    passportTag.position.set(0, 0.16, 0.11);
    passportTag.userData.partName = 'passport';
    scene.add(passportTag);

    const grid = new THREE.GridHelper(6, 12, 0x1e293b, 0x0f172a);
    grid.position.y = -0.3;
    scene.add(grid);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const interactive = [beam, leftModule, rightModule, passportTag, ...bolts];
    let hovered = null;
    let rafId = null;

    const onPointerMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      hovered = raycaster.intersectObjects(interactive)[0]?.object ?? null;
    };

    const onClick = () => {
      if (hovered?.userData?.partName === 'passport') onOpenPassport();
    };

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);

    const animate = () => {
      const { exploded: isExploded, moduleState: currentModuleState } = stateRef.current;
      const base = isExploded ? 0.42 : 0.25;
      const targetLeft = currentModuleState === 'removed' ? -1.25 : -base;
      const targetRight = currentModuleState === 'replaced' ? base + 0.2 : base;

      leftModule.position.x = smoothLerp(leftModule.position.x, targetLeft, 0.12);
      rightModule.position.x = smoothLerp(rightModule.position.x, targetRight, 0.12);

      beam.material.color.set(hovered === beam ? COLORS.highlight : COLORS.structural);
      leftModule.material.color.set(hovered === leftModule ? COLORS.highlight : COLORS.reusable);
      rightModule.material.color.set(hovered === rightModule ? COLORS.highlight : COLORS.reusable);
      passportTag.material.color.set(hovered === passportTag ? COLORS.highlight : COLORS.qr);
      bolts.forEach((bolt) => bolt.material.color.set(hovered?.userData?.partName === 'bolt' ? COLORS.highlight : COLORS.removable));

      controls.update();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [onOpenPassport]);

  return (
    <div className="relative h-[520px] w-full rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
      <div ref={mountRef} className="h-full w-full" />
      <button
        type="button"
        onClick={onOpenPassport}
        className="absolute left-1/2 top-4 -translate-x-1/2 rounded bg-white/90 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-900"
      >
        QR PASS
      </button>
    </div>
  );
}
