import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Center, ContactShadows } from '@react-three/drei';
import { useConfigurator } from '../context/ConfiguratorContext';
import { useMultiplayer } from '../context/MultiplayerContext';
import { SportsCarModel, LoungeChairModel, SneakerModel } from './ProceduralModels';
import * as THREE from 'three';

// -------------------------------------------------------------
// DYNAMIC LIGHTING COMPONENT BASED ON SELECTED ENVIRONMENT
// -------------------------------------------------------------
const CustomLighting: React.FC<{ environment: string }> = ({ environment }) => {
  switch (environment) {
    case 'Neon':
      return (
        <>
          <ambientLight intensity={0.4} color="#1d1e2c" />
          <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ec4899" castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={1.5} color="#06b6d4" />
          <pointLight position={[0, 4, 0]} intensity={2.0} color="#8b5cf6" />
        </>
      );
    case 'Warm':
      return (
        <>
          <ambientLight intensity={0.5} color="#fffcf2" />
          <directionalLight position={[6, 8, 4]} intensity={2.0} color="#f59e0b" castShadow />
          <directionalLight position={[-6, 4, -4]} intensity={0.6} color="#d97706" />
          <pointLight position={[3, 5, -2]} intensity={1.0} color="#ffedd5" />
        </>
      );
    case 'Dramatic':
      return (
        <>
          <ambientLight intensity={0.1} color="#020617" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.4}
            penumbra={0.8}
            intensity={4.0}
            color="#ffffff"
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight position={[3, 2, 5]} intensity={0.3} color="#ffffff" />
        </>
      );
    case 'Studio':
    default:
      return (
        <>
          <ambientLight intensity={0.8} color="#ffffff" />
          <directionalLight position={[10, 12, 10]} intensity={1.2} color="#ffffff" castShadow />
          <directionalLight position={[-10, 8, -10]} intensity={0.4} color="#cbd5e1" />
        </>
      );
  }
};

// -------------------------------------------------------------
// COLLABORATIVE MOUSE CURSOR RENDERER
// -------------------------------------------------------------
const RemoteCursors: React.FC = () => {
  const { remoteCursors } = useMultiplayer();

  return (
    <>
      {Object.values(remoteCursors).map((cur) => (
        <group key={cur.userId} position={[cur.x, cur.y, cur.z]}>
          <mesh>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#8b5cf6" toneMapped={false} />
          </mesh>
          <Html distanceFactor={6} center position={[0, 0.15, 0]}>
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-900/90 text-white text-[10px] font-medium border border-violet-500/30 whitespace-nowrap shadow-lg">
              <img src={cur.avatar} alt="" className="w-3.5 h-3.5 rounded-full" />
              <span>{cur.name}</span>
            </div>
          </Html>
        </group>
      ))}
    </>
  );
};

// -------------------------------------------------------------
// SPATIAL ANNOTATIONS / COMMENTS PINS
// -------------------------------------------------------------
const SpatialCommentPins: React.FC = () => {
  const { comments, resolveComment } = useConfigurator();

  return (
    <>
      {comments.filter(c => !c.isResolved).map((c, idx) => (
        <group key={c.id || idx} position={[c.posX, c.posY, c.posZ]}>
          <mesh>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <Html distanceFactor={6} center position={[0, 0.1, 0]}>
            <div className="relative group/pin">
              {/* Pinned Glowing Dot */}
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shadow-md cursor-pointer border border-white hover:scale-110 transition-transform">
                {idx + 1}
              </div>
              
              {/* Popover Hover Card */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:pointer-events-auto transition-opacity duration-200 z-50">
                <div className="p-2.5 rounded-lg bg-slate-950/95 border border-red-500/30 text-white text-xs shadow-xl backdrop-blur-md">
                  <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-slate-400">
                    <img src={c.user.avatar || ''} className="w-3.5 h-3.5 rounded-full" alt="" />
                    <span className="font-semibold text-slate-300">{c.user.name}</span>
                  </div>
                  <p className="mb-2 leading-relaxed">{c.text}</p>
                  <button
                    onClick={() => resolveComment(c.id)}
                    className="w-full py-1 text-[10px] bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-medium rounded"
                  >
                    Resolve Comment
                  </button>
                </div>
              </div>
            </div>
          </Html>
        </group>
      ))}
    </>
  );
};

// -------------------------------------------------------------
// MAIN CANVAS COMPONENT
// -------------------------------------------------------------
export const ConfiguratorCanvas: React.FC<{ explodedProgress?: number }> = ({ explodedProgress = 0 }) => {
  const { category, materials, activePart, setActivePart, environment, postComment } = useConfigurator();
  const { broadcastCursor } = useMultiplayer();

  // Track double click or click to place a comment pin
  const handlePointerDown = (e: any) => {
    // Only place comments if shift key is pressed (UX rule to prevent comment placement clutter)
    if (e.shiftKey && e.point) {
      e.stopPropagation();
      const txt = prompt('Enter design note for this 3D location:');
      if (txt) {
        const x = Number(e.point.x.toFixed(3));
        const y = Number(e.point.y.toFixed(3));
        const z = Number(e.point.z.toFixed(3));
        postComment(txt, x, y, z);
      }
    } else {
      // Track pointer ticks for collaborative cursors
      if (e.point) {
        broadcastCursor(
          Number(e.point.x.toFixed(3)),
          Number(e.point.y.toFixed(3)),
          Number(e.point.z.toFixed(3))
        );
      }
    }
  };

  const handlePointerMove = (e: any) => {
    if (e.point) {
      broadcastCursor(
        Number(e.point.x.toFixed(3)),
        Number(e.point.y.toFixed(3)),
        Number(e.point.z.toFixed(3))
      );
    }
  };

  const onPartClick = (partName: string) => {
    setActivePart(partName);
  };

  return (
    <div className="w-full h-full relative outline-none select-none">
      {/* Informative Hotkey Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/30 text-[10px] text-slate-300 font-medium">
        💡 <span className="text-violet-400 font-semibold">Shift + Click</span> on product to drop a feedback pin
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 2.2, 4.5], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <Suspense fallback={null}>
          <CustomLighting environment={environment} />

          <Center>
            {category === 'car' && (
              <SportsCarModel
                materials={materials}
                explodedProgress={explodedProgress}
                activePart={activePart}
                onPartClick={onPartClick}
              />
            )}
            {category === 'chair' && (
              <LoungeChairModel
                materials={materials}
                explodedProgress={explodedProgress}
                activePart={activePart}
                onPartClick={onPartClick}
              />
            )}
            {category === 'sneaker' && (
              <SneakerModel
                materials={materials}
                explodedProgress={explodedProgress}
                activePart={activePart}
                onPartClick={onPartClick}
              />
            )}
          </Center>

          <ContactShadows
            position={[0, -0.58, 0]}
            opacity={0.65}
            scale={10}
            blur={1.8}
            far={1.2}
          />

          {/* Collaborative elements */}
          <RemoteCursors />
          <SpatialCommentPins />

          <OrbitControls 
            makeDefault 
            maxPolarAngle={Math.PI / 2.1} 
            minDistance={2.5} 
            maxDistance={8} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
export default ConfiguratorCanvas;
