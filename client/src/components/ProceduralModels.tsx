import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialConfig } from '../context/ConfiguratorContext';

interface ModelProps {
  materials: Record<string, MaterialConfig>;
  explodedProgress: number;
  activePart: string | null;
  onPartClick: (partName: string) => void;
}

// -------------------------------------------------------------
// 1. SPORTS CAR MODEL (Premium 3D Geometry)
// -------------------------------------------------------------
export const SportsCarModel: React.FC<ModelProps> = ({ materials, explodedProgress, activePart, onPartClick }) => {
  const groupRef = useRef<THREE.Group>(null);

  const getMatProps = (part: string) => {
    const mat = materials[part] || { color: '#ffffff', metalness: 0.5, roughness: 0.5, clearcoat: 0.0 };
    return {
      color: mat.color,
      metalness: mat.metalness,
      roughness: mat.roughness,
      clearcoat: mat.clearcoat,
      transparent: mat.opacity !== undefined && mat.opacity < 1.0,
      opacity: mat.opacity ?? 1.0,
      emissive: mat.emissive ? new THREE.Color(mat.emissive) : new THREE.Color('#000000')
    };
  };

  useFrame((state) => {
    if (groupRef.current && explodedProgress === 0) {
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.04;
    }
  });

  const getOffset = (basePos: [number, number, number], direction: [number, number, number], scale = 1.4) => {
    const p = explodedProgress * scale;
    return [
      basePos[0] + direction[0] * p,
      basePos[1] + direction[1] * p,
      basePos[2] + direction[2] * p
    ] as [number, number, number];
  };

  return (
    <group ref={groupRef}>
      {/* Sleek Under-Chassis Panel */}
      <mesh position={getOffset([0, 0.12, 0], [0, 0.2, 0])} castShadow receiveShadow>
        <boxGeometry args={[1.72, 0.08, 3.4]} />
        <meshPhysicalMaterial color="#0b0f19" metalness={0.9} roughness={0.6} />
      </mesh>

      {/* Main Car Body Panel with custom panel gaps */}
      <mesh
        position={getOffset([0, 0.36, 0], [0, 0.6, 0])}
        onClick={(e) => { e.stopPropagation(); onPartClick('body'); }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.78, 0.38, 3.58]} />
        <meshPhysicalMaterial {...getMatProps('body')} />
      </mesh>

      {/* Streamlined Cabin Shell */}
      <mesh
        position={getOffset([0, 0.56, -0.2], [0, 0.9, -0.1])}
        onClick={(e) => { e.stopPropagation(); onPartClick('body'); }}
        castShadow
      >
        <boxGeometry args={[1.44, 0.24, 1.8]} />
        <meshPhysicalMaterial {...getMatProps('body')} />
      </mesh>

      {/* Futuristic Windshield Glass */}
      <mesh
        position={getOffset([0, 0.62, 0.3], [0, 1.1, 0.15])}
        onClick={(e) => { e.stopPropagation(); onPartClick('glass'); }}
        castShadow
      >
        <boxGeometry args={[1.36, 0.32, 1.1]} />
        <meshPhysicalMaterial {...getMatProps('glass')} />
      </mesh>

      {/* Front Glowing LED Headlamps (Emissive White) */}
      <group position={getOffset([0, 0.32, 1.76], [0, 0.5, 0.3])}>
        {/* Left Headlamp */}
        <mesh position={[-0.65, 0, 0]}>
          <boxGeometry args={[0.26, 0.06, 0.08]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        {/* Right Headlamp */}
        <mesh position={[0.65, 0, 0]}>
          <boxGeometry args={[0.26, 0.06, 0.08]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </group>

      {/* Rear Glowing Neon Tail-lights (Emissive Red) */}
      <group position={getOffset([0, 0.44, -1.82], [0, 0.7, -0.3])}>
        <mesh>
          <boxGeometry args={[1.5, 0.04, 0.06]} />
          <meshBasicMaterial color="#ef4444" toneMapped={false} />
        </mesh>
      </group>

      {/* High-End Carbon Composite Rear Wing */}
      <group position={getOffset([0, 0.72, -1.6], [0, 0.9, -0.5])}>
        {/* Wing Blade */}
        <mesh onClick={(e) => { e.stopPropagation(); onPartClick('body'); }} castShadow>
          <boxGeometry args={[1.86, 0.04, 0.38]} />
          <meshPhysicalMaterial {...getMatProps('body')} />
        </mesh>
        {/* Left Support Strut */}
        <mesh position={[-0.7, -0.2, 0]} castShadow>
          <boxGeometry args={[0.04, 0.38, 0.1]} />
          <meshPhysicalMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Right Support Strut */}
        <mesh position={[0.7, -0.2, 0]} castShadow>
          <boxGeometry args={[0.04, 0.38, 0.1]} />
          <meshPhysicalMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Premium Interior Cockpit Seats */}
      <mesh
        position={getOffset([0, 0.42, -0.15], [0, 0.45, -0.15])}
        onClick={(e) => { e.stopPropagation(); onPartClick('interior'); }}
      >
        <boxGeometry args={[1.24, 0.28, 0.96]} />
        <meshPhysicalMaterial {...getMatProps('interior')} />
      </mesh>

      {/* WHEELS AND BRAKE CALIPERS ASSEMBLY */}
      {/* Front Left */}
      <group position={getOffset([-1.05, 0.22, 1.12], [-0.75, 0, 0.35], 1.25)}>
        {/* Outer Rubber Tire */}
        <mesh onClick={(e) => { e.stopPropagation(); onPartClick('wheels'); }} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 0.36, 24]} />
          <meshPhysicalMaterial color="#181a1f" roughness={0.85} metalness={0.0} />
        </mesh>
        {/* Inner Premium Metal Rim */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.38, 16]} />
          <meshPhysicalMaterial {...getMatProps('wheels')} />
        </mesh>
        {/* Glowing Sport Caliper */}
        <mesh position={[-0.08, 0.18, 0]} onClick={(e) => { e.stopPropagation(); onPartClick('calipers'); }}>
          <boxGeometry args={[0.06, 0.22, 0.12]} />
          <meshPhysicalMaterial {...getMatProps('calipers')} />
        </mesh>
      </group>

      {/* Front Right */}
      <group position={getOffset([1.05, 0.22, 1.12], [0.75, 0, 0.35], 1.25)}>
        <mesh onClick={(e) => { e.stopPropagation(); onPartClick('wheels'); }} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 0.36, 24]} />
          <meshPhysicalMaterial color="#181a1f" roughness={0.85} metalness={0.0} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.38, 16]} />
          <meshPhysicalMaterial {...getMatProps('wheels')} />
        </mesh>
        <mesh position={[0.08, 0.18, 0]} onClick={(e) => { e.stopPropagation(); onPartClick('calipers'); }}>
          <boxGeometry args={[0.06, 0.22, 0.12]} />
          <meshPhysicalMaterial {...getMatProps('calipers')} />
        </mesh>
      </group>

      {/* Rear Left */}
      <group position={getOffset([-1.05, 0.22, -1.12], [-0.75, 0, -0.35], 1.25)}>
        <mesh onClick={(e) => { e.stopPropagation(); onPartClick('wheels'); }} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 0.42, 24]} />
          <meshPhysicalMaterial color="#181a1f" roughness={0.85} metalness={0.0} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.44, 16]} />
          <meshPhysicalMaterial {...getMatProps('wheels')} />
        </mesh>
        <mesh position={[-0.08, 0.18, 0]} onClick={(e) => { e.stopPropagation(); onPartClick('calipers'); }}>
          <boxGeometry args={[0.06, 0.22, 0.12]} />
          <meshPhysicalMaterial {...getMatProps('calipers')} />
        </mesh>
      </group>

      {/* Rear Right */}
      <group position={getOffset([1.05, 0.22, -1.12], [0.75, 0, -0.35], 1.25)}>
        <mesh onClick={(e) => { e.stopPropagation(); onPartClick('wheels'); }} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 0.42, 24]} />
          <meshPhysicalMaterial color="#181a1f" roughness={0.85} metalness={0.0} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.44, 16]} />
          <meshPhysicalMaterial {...getMatProps('wheels')} />
        </mesh>
        <mesh position={[0.08, 0.18, 0]} onClick={(e) => { e.stopPropagation(); onPartClick('calipers'); }}>
          <boxGeometry args={[0.06, 0.22, 0.12]} />
          <meshPhysicalMaterial {...getMatProps('calipers')} />
        </mesh>
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// 2. LOUNGE CHAIR MODEL (Premium 3D Geometry)
// -------------------------------------------------------------
export const LoungeChairModel: React.FC<ModelProps> = ({ materials, explodedProgress, onPartClick }) => {
  const getMatProps = (part: string) => {
    const mat = materials[part] || { color: '#ffffff', metalness: 0.2, roughness: 0.5, clearcoat: 0.0 };
    return {
      color: mat.color,
      metalness: mat.metalness,
      roughness: mat.roughness,
      clearcoat: mat.clearcoat,
      transparent: mat.opacity !== undefined && mat.opacity < 1.0,
      opacity: mat.opacity ?? 1.0,
      emissive: mat.emissive ? new THREE.Color(mat.emissive) : new THREE.Color('#000000')
    };
  };

  const getOffset = (basePos: [number, number, number], direction: [number, number, number]) => {
    const p = explodedProgress * 1.35;
    return [
      basePos[0] + direction[0] * p,
      basePos[1] + direction[1] * p,
      basePos[2] + direction[2] * p
    ] as [number, number, number];
  };

  return (
    <group>
      {/* Solid Polished Base Block */}
      <mesh
        position={getOffset([0, -0.62, 0], [0, -0.5, 0])}
        onClick={(e) => { e.stopPropagation(); onPartClick('base'); }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.24, 0.14, 1.24]} />
        <meshPhysicalMaterial {...getMatProps('base')} />
      </mesh>

      {/* Chrome Supporting Stem Cylinder */}
      <mesh
        position={getOffset([0, -0.32, 0], [0, -0.2, 0])}
        onClick={(e) => { e.stopPropagation(); onPartClick('frame'); }}
        castShadow
      >
        <cylinderGeometry args={[0.06, 0.06, 0.46, 16]} />
        <meshPhysicalMaterial {...getMatProps('frame')} />
      </mesh>

      {/* Structural Supporting Outer Frame */}
      <mesh
        position={getOffset([0, 0.08, 0.08], [0, 0.15, -0.15])}
        onClick={(e) => { e.stopPropagation(); onPartClick('frame'); }}
        castShadow
      >
        <boxGeometry args={[1.14, 0.08, 1.34]} />
        <meshPhysicalMaterial {...getMatProps('frame')} />
      </mesh>

      {/* Ergonomic Curved Armrests */}
      <group position={getOffset([0, 0.38, 0.1], [0, 0.3, -0.1])}>
        {/* Left Armrest */}
        <mesh position={[-0.6, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.4, 0.9]} />
          <meshPhysicalMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Right Armrest */}
        <mesh position={[0.6, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.4, 0.9]} />
          <meshPhysicalMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Seat Cushion Layer */}
      <group position={getOffset([0, 0.22, 0.14], [0, 0.4, 0.15])}>
        <mesh onClick={(e) => { e.stopPropagation(); onPartClick('cushions'); }} castShadow>
          <boxGeometry args={[1.02, 0.18, 1.02]} />
          <meshPhysicalMaterial {...getMatProps('cushions')} />
        </mesh>
        {/* Stitching Line Accents */}
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[0.96, 0.01, 0.96]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>
      </group>

      {/* Backrest Pillow Cushion */}
      <group position={getOffset([0, 0.72, -0.28], [0, 0.7, -0.35])} rotation={[-Math.PI / 8, 0, 0]}>
        <mesh onClick={(e) => { e.stopPropagation(); onPartClick('cushions'); }} castShadow>
          <boxGeometry args={[1.02, 0.15, 0.72]} />
          <meshPhysicalMaterial {...getMatProps('cushions')} />
        </mesh>
        {/* Stitching button centers */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.8, 0.01, 0.5]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// 3. SNEAKER MODEL (Premium 3D Geometry)
// -------------------------------------------------------------
export const SneakerModel: React.FC<ModelProps> = ({ materials, explodedProgress, onPartClick }) => {
  const getMatProps = (part: string) => {
    const mat = materials[part] || { color: '#ffffff', metalness: 0.1, roughness: 0.5, clearcoat: 0.0 };
    return {
      color: mat.color,
      metalness: mat.metalness,
      roughness: mat.roughness,
      clearcoat: mat.clearcoat,
      transparent: mat.opacity !== undefined && mat.opacity < 1.0,
      opacity: mat.opacity ?? 1.0,
      emissive: mat.emissive ? new THREE.Color(mat.emissive) : new THREE.Color('#000000')
    };
  };

  const getOffset = (basePos: [number, number, number], direction: [number, number, number]) => {
    const p = explodedProgress * 1.45;
    return [
      basePos[0] + direction[0] * p,
      basePos[1] + direction[1] * p,
      basePos[2] + direction[2] * p
    ] as [number, number, number];
  };

  return (
    <group rotation={[0, -Math.PI / 4, 0]}>
      {/* Multi-layered Running Sole */}
      <group position={getOffset([0, -0.38, 0], [0, -0.6, 0])}>
        {/* Main Cushion Sole */}
        <mesh onClick={(e) => { e.stopPropagation(); onPartClick('sole'); }} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.22, 2.02]} />
          <meshPhysicalMaterial {...getMatProps('sole')} />
        </mesh>
        
        {/* Sole Grip grooves */}
        <group position={[0, -0.12, 0]}>
          <mesh position={[0, 0, 0.6]}>
            <boxGeometry args={[0.74, 0.04, 0.12]} />
            <meshBasicMaterial color="#1a1d20" />
          </mesh>
          <mesh position={[0, 0, 0.2]}>
            <boxGeometry args={[0.74, 0.04, 0.12]} />
            <meshBasicMaterial color="#1a1d20" />
          </mesh>
          <mesh position={[0, 0, -0.2]}>
            <boxGeometry args={[0.74, 0.04, 0.12]} />
            <meshBasicMaterial color="#1a1d20" />
          </mesh>
          <mesh position={[0, 0, -0.6]}>
            <boxGeometry args={[0.74, 0.04, 0.12]} />
            <meshBasicMaterial color="#1a1d20" />
          </mesh>
        </group>
      </group>

      {/* Knitted Upper Shell */}
      <mesh
        position={getOffset([0, 0.02, 0.06], [0, 0.35, 0.08])}
        onClick={(e) => { e.stopPropagation(); onPartClick('upper'); }}
        castShadow
      >
        <boxGeometry args={[0.66, 0.58, 1.72]} />
        <meshPhysicalMaterial {...getMatProps('upper')} />
      </mesh>

      {/* Cyber Side Branding (Glowing LED stripes) */}
      <group position={getOffset([0, 0.02, 0.06], [0.15, 0.45, 0.08])}>
        {/* Left stripe */}
        <mesh position={[-0.34, 0, 0]}>
          <boxGeometry args={[0.01, 0.12, 0.6]} />
          <meshBasicMaterial color="#ec4899" toneMapped={false} />
        </mesh>
        {/* Right stripe */}
        <mesh position={[0.34, 0, 0]}>
          <boxGeometry args={[0.01, 0.12, 0.6]} />
          <meshBasicMaterial color="#ec4899" toneMapped={false} />
        </mesh>
      </group>

      {/* Cyber Trim Accent Support Shell */}
      <mesh
        position={getOffset([0, 0.12, -0.38], [0.25, 0.55, -0.25])}
        onClick={(e) => { e.stopPropagation(); onPartClick('accents'); }}
        castShadow
      >
        <boxGeometry args={[0.74, 0.36, 0.62]} />
        <meshPhysicalMaterial {...getMatProps('accents')} />
      </mesh>

      {/* High-Tensile Knitted Laces */}
      <mesh
        position={getOffset([0, 0.32, 0.38], [0, 0.75, 0.25])}
        onClick={(e) => { e.stopPropagation(); onPartClick('laces'); }}
        rotation={[Math.PI / 6, 0, 0]}
      >
        <boxGeometry args={[0.32, 0.04, 0.58]} />
        <meshPhysicalMaterial {...getMatProps('laces')} />
      </mesh>
    </group>
  );
};
