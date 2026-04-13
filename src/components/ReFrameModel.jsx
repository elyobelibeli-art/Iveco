import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { smoothLerp } from '../utils/animation';

const COLORS = {
  structural: '#3b82f6',
  reusable: '#16a34a',
  removable: '#f97316',
  highlight: '#fde047',
};

function Bolt({ position, hoveredPart, setHoveredPart }) {
  const isHovered = hoveredPart === 'bolt';
  return (
    <mesh
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredPart('bolt');
      }}
      onPointerOut={() => setHoveredPart(null)}
    >
      <cylinderGeometry args={[0.025, 0.025, 0.08, 20]} />
      <meshStandardMaterial color={isHovered ? COLORS.highlight : COLORS.removable} />
    </mesh>
  );
}

function HolePattern({ sideX }) {
  const holePositions = [-0.06, 0, 0.06];
  return (
    <group position={[sideX, 0, 0]}>
      {holePositions.map((yPos) => (
        <mesh key={`${sideX}-${yPos}`} position={[0, yPos, 0.11]}>
          <cylinderGeometry args={[0.016, 0.016, 0.02, 16]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ exploded, moduleState, onOpenPassport }) {
  const leftRef = useRef();
  const rightRef = useRef();
  const [hoveredPart, setHoveredPart] = useState(null);

  const targetOffsets = useMemo(() => {
    // When exploded, modules slide away from center.
    const base = exploded ? 0.42 : 0.25;

    // Circularity simulation: hide or offset modules depending on lifecycle action.
    const left = moduleState === 'removed' ? -1.25 : -base;
    const right = moduleState === 'replaced' ? base + 0.2 : base;

    return { left, right };
  }, [exploded, moduleState]);

  useFrame(() => {
    if (!leftRef.current || !rightRef.current) return;

    leftRef.current.position.x = smoothLerp(leftRef.current.position.x, targetOffsets.left, 0.12);
    rightRef.current.position.x = smoothLerp(rightRef.current.position.x, targetOffsets.right, 0.12);
  });

  const moduleColor = (name) => (hoveredPart === name ? COLORS.highlight : COLORS.reusable);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 3]} intensity={1.2} />

      {/* Central structural beam */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('beam');
        }}
        onPointerOut={() => setHoveredPart(null)}
      >
        <boxGeometry args={[2.0, 0.2, 0.2]} />
        <meshStandardMaterial color={hoveredPart === 'beam' ? COLORS.highlight : COLORS.structural} />
      </mesh>

      {/* Left detachable interface module */}
      <mesh
        ref={leftRef}
        position={[-0.25, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('left-module');
        }}
        onPointerOut={() => setHoveredPart(null)}
      >
        <boxGeometry args={[0.28, 0.28, 0.28]} />
        <meshStandardMaterial color={moduleColor('left-module')} />
      </mesh>

      {/* Right detachable interface module */}
      <mesh
        ref={rightRef}
        position={[0.25, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('right-module');
        }}
        onPointerOut={() => setHoveredPart(null)}
      >
        <boxGeometry args={[0.28, 0.28, 0.28]} />
        <meshStandardMaterial color={moduleColor('right-module')} />
      </mesh>

      {/* Symmetric bolt positions near both interfaces */}
      <Bolt position={[-0.15, 0.08, 0.11]} hoveredPart={hoveredPart} setHoveredPart={setHoveredPart} />
      <Bolt position={[-0.15, -0.08, 0.11]} hoveredPart={hoveredPart} setHoveredPart={setHoveredPart} />
      <Bolt position={[0.15, 0.08, 0.11]} hoveredPart={hoveredPart} setHoveredPart={setHoveredPart} />
      <Bolt position={[0.15, -0.08, 0.11]} hoveredPart={hoveredPart} setHoveredPart={setHoveredPart} />

      {/* Universal mounting pattern */}
      <HolePattern sideX={-0.22} />
      <HolePattern sideX={0.22} />

      {/* Mock QR passport tag */}
      <mesh position={[0, 0.16, 0.11]} onClick={onOpenPassport}>
        <boxGeometry args={[0.16, 0.09, 0.01]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <Html position={[0, 0.16, 0.117]} center>
        <button
          type="button"
          onClick={onOpenPassport}
          className="text-[9px] font-bold tracking-wide text-slate-900 bg-white/90 px-1 py-0.5 rounded"
        >
          QR PASS
        </button>
      </Html>

      <OrbitControls enablePan={false} />
      <gridHelper args={[6, 12, '#1e293b', '#0f172a']} position={[0, -0.3, 0]} />
    </>
  );
}

export default function ReFrameModel(props) {
  return (
    <div className="h-[520px] w-full rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
      <Canvas camera={{ position: [1.8, 1.2, 2.2], fov: 45 }}>
        <Scene {...props} />
      </Canvas>
    </div>
  );
}
