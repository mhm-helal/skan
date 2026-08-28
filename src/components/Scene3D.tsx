"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  RoundedBox,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";

/* ─── السرير ─── */
function Bed() {
  const blanketRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (blanketRef.current) {
      blanketRef.current.position.y =
        0.55 + Math.sin(state.clock.elapsedTime * 0.8) * 0.008;
    }
  });
  return (
    <group position={[-1.8, 0, -0.5]}>
      <RoundedBox args={[2.2, 0.35, 1.8]} radius={0.04} position={[0, 0.17, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#3d2a5c" roughness={0.6} metalness={0.1} />
      </RoundedBox>
      <RoundedBox args={[2.05, 0.18, 1.65]} radius={0.06} position={[0, 0.42, 0]} castShadow>
        <meshStandardMaterial color="#f5f0ff" roughness={0.85} metalness={0} />
      </RoundedBox>
      <RoundedBox args={[0.55, 0.12, 0.35]} radius={0.05} position={[-0.35, 0.56, -0.55]} castShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.55, 0.12, 0.35]} radius={0.05} position={[0.35, 0.56, -0.55]} castShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </RoundedBox>
      <mesh ref={blanketRef} position={[0, 0.55, 0.15]} castShadow>
        <boxGeometry args={[1.9, 0.08, 1.1]} />
        <meshStandardMaterial color="#c084fc" roughness={0.75} metalness={0} />
      </mesh>
      <RoundedBox args={[1.9, 0.14, 0.12]} radius={0.04} position={[0, 0.52, 0.68]} castShadow>
        <meshStandardMaterial color="#a855f7" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[2.2, 1.0, 0.1]} radius={0.05} position={[0, 0.85, -0.85]} castShadow>
        <meshStandardMaterial color="#2d1b4e" roughness={0.5} metalness={0.15} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.5, 0.02]} radius={0.1} position={[-0.55, 0.85, -0.79]} castShadow>
        <meshStandardMaterial color="#4c1d95" roughness={0.4} metalness={0.2} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.5, 0.02]} radius={0.1} position={[0.55, 0.85, -0.79]} castShadow>
        <meshStandardMaterial color="#4c1d95" roughness={0.4} metalness={0.2} />
      </RoundedBox>
    </group>
  );
}
/* ─── المكتب والكرسي ─── */
function Desk() {
  return (
    <group position={[2.2, 0, -1.5]}>
      <RoundedBox args={[1.6, 0.06, 0.8]} radius={0.02} position={[0, 0.72, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#c2956b" roughness={0.35} metalness={0.05} />
      </RoundedBox>
      <RoundedBox args={[0.06, 0.72, 0.06]} radius={0.02} position={[-0.7, 0.36, -0.32]} castShadow>
        <meshStandardMaterial color="#1a1a2e" roughness={0.4} metalness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.06, 0.72, 0.06]} radius={0.02} position={[0.7, 0.36, -0.32]} castShadow>
        <meshStandardMaterial color="#1a1a2e" roughness={0.4} metalness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.06, 0.72, 0.06]} radius={0.02} position={[-0.7, 0.36, 0.32]} castShadow>
        <meshStandardMaterial color="#1a1a2e" roughness={0.4} metalness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.06, 0.72, 0.06]} radius={0.02} position={[0.7, 0.36, 0.32]} castShadow>
        <meshStandardMaterial color="#1a1a2e" roughness={0.4} metalness={0.3} />
      </RoundedBox>
      <group position={[0, 0.78, -0.1]}>
        <RoundedBox args={[0.55, 0.35, 0.02]} radius={0.01} position={[0, 0.17, 0]} castShadow>
          <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.5} />
        </RoundedBox>
        <RoundedBox args={[0.48, 0.28, 0.005]} radius={0.005} position={[0, 0.18, 0.012]}>
          <meshStandardMaterial color="#1e1b4b" emissive="#6366f1" emissiveIntensity={0.4} roughness={0.1} />
        </RoundedBox>
        <RoundedBox args={[0.55, 0.015, 0.35]} radius={0.005} position={[0, 0.005, 0.12]} castShadow>
          <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.6} />
        </RoundedBox>
      </group>
      <group position={[0.5, 0.78, 0.15]}>
        <mesh position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.035, 0.14, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0.045, 0.07, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.025, 0.006, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
        </mesh>
        <Steam />
      </group>
      <RoundedBox args={[0.25, 0.03, 0.18]} radius={0.005} position={[-0.45, 0.77, 0.1]} rotation={[0, 0.2, 0]} castShadow>
        <meshStandardMaterial color="#dc2626" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.23, 0.025, 0.17]} radius={0.005} position={[-0.45, 0.795, 0.1]} rotation={[0, 0.2, 0]} castShadow>
        <meshStandardMaterial color="#1e40af" roughness={0.7} />
      </RoundedBox>
      <group position={[0, 0, 0.8]}>
        <RoundedBox args={[0.5, 0.06, 0.5]} radius={0.02} position={[0, 0.42, 0]} castShadow>
          <meshStandardMaterial color="#1e1b4b" roughness={0.5} metalness={0.2} />
        </RoundedBox>
        <RoundedBox args={[0.5, 0.55, 0.06]} radius={0.02} position={[0, 0.72, -0.22]} castShadow>
          <meshStandardMaterial color="#1e1b4b" roughness={0.5} metalness={0.2} />
        </RoundedBox>
        {[[-0.18, 0.18], [0.18, 0.18], [-0.18, -0.18], [0.18, -0.18]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.2, z]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
            <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Steam() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        mesh.position.y = 0.15 + ((state.clock.elapsedTime * 0.3 + i * 0.15) % 0.4);
        mesh.scale.setScalar(0.5 + ((state.clock.elapsedTime * 0.3 + i * 0.15) % 0.4));
        (mesh.material as THREE.MeshStandardMaterial).opacity =
          0.3 - ((state.clock.elapsedTime * 0.3 + i * 0.15) % 0.4) * 0.6;
      });
    }
  });
  return (
    <group ref={ref}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 0.02 - 0.02, 0.15, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}
/* ─── النافذة والستائر ─── */
function WindowFrame() {
  const curtainRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (curtainRef.current) {
      curtainRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });
  return (
    <group position={[0, 1.5, -2.9]}>
      <RoundedBox args={[1.8, 1.4, 0.08]} radius={0.02} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.1} />
      </RoundedBox>
      <RoundedBox args={[1.6, 1.2, 0.02]} radius={0.01} position={[0, 0, 0.02]}>
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.3} roughness={0.05} metalness={0.1} />
      </RoundedBox>
      <RoundedBox args={[1.6, 0.03, 0.04]} radius={0.01} position={[0, 0, 0.04]}>
        <meshStandardMaterial color="#e5e5e5" roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.03, 1.2, 0.04]} radius={0.01} position={[0, 0, 0.04]}>
        <meshStandardMaterial color="#e5e5e5" roughness={0.3} />
      </RoundedBox>
      <mesh ref={curtainRef} position={[-1.1, 0.1, 0.1]} castShadow>
        <boxGeometry args={[0.5, 1.6, 0.03]} />
        <meshStandardMaterial color="#fda4af" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[1.1, 0.1, 0.1]} castShadow>
        <boxGeometry args={[0.5, 1.6, 0.03]} />
        <meshStandardMaterial color="#fda4af" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0, 0, 0.5]} intensity={0.8} color="#fef3c7" distance={4} />
    </group>
  );
}

/* ─── رف الكتب ─── */
function Bookshelf() {
  const colors = ["#dc2626","#1e40af","#059669","#d97706","#7c3aed","#db2777","#0891b2","#65a30d","#ea580c","#6366f1"];
  const bookHeights = useMemo(() => Array.from({length: 15}, () => 0.28 + Math.random() * 0.14), []);
  return (
    <group position={[3.2, 0, 0.5]}>
      <RoundedBox args={[0.8, 2.0, 0.35]} radius={0.02} position={[0, 1.0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2d1b4e" roughness={0.5} metalness={0.1} />
      </RoundedBox>
      {[0.5, 1.0, 1.5].map((y) => (
        <RoundedBox key={y} args={[0.75, 0.04, 0.33]} radius={0.01} position={[0, y, 0.01]} castShadow>
          <meshStandardMaterial color="#3d2a5c" roughness={0.4} />
        </RoundedBox>
      ))}
      {[0.5, 1.0, 1.5].map((shelfY, si) =>
        Array.from({ length: 5 }).map((_, i) => (
          <RoundedBox
            key={`book-${si}-${i}`}
            args={[0.08, bookHeights[si * 5 + i], 0.22]}
            radius={0.005}
            position={[-0.28 + i * 0.14, shelfY + bookHeights[si * 5 + i] / 2 + 0.02, 0.02]}
            castShadow
          >
            <meshStandardMaterial color={colors[(si * 5 + i) % colors.length]} roughness={0.7} />
          </RoundedBox>
        ))
      )}
    </group>
  );
}

/* ─── النجفة ─── */
function Chandelier() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.15;
  });
  return (
    <group ref={ref} position={[0, 2.6, 0]}>
      <mesh>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.3, 8]} />
        <meshStandardMaterial color="#a1a1aa" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.32, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.2} metalness={0.7} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh position={[0.2, -0.35, 0]} rotation={[0, 0, -0.3]}>
              <cylinderGeometry args={[0.008, 0.008, 0.25, 8]} />
              <meshStandardMaterial color="#a1a1aa" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0.32, -0.4, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={1.2} roughness={0.1} />
            </mesh>
            <pointLight position={[0.32, -0.4, 0]} intensity={0.3} color="#fbbf24" distance={3} />
          </group>
        );
      })}
    </group>
  );
}
/* ─── النبات ─── */
function Plant() {
  const leavesRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (leavesRef.current) {
      leavesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });
  return (
    <group position={[-3.0, 0, -2.0]}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.4, 12]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.41, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 12]} />
        <meshStandardMaterial color="#451a03" roughness={0.95} />
      </mesh>
      <group ref={leavesRef}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const angle = (i / 7) * Math.PI * 2;
          const h = 0.25 + (i % 3) * 0.08;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.12, 0.5 + i * 0.05, Math.sin(angle) * 0.12]}
              rotation={[0.4 - i * 0.08, angle, 0.2]}
              castShadow
            >
              <boxGeometry args={[0.07, h, 0.015]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#16a34a" : "#22c55e"} roughness={0.7} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/* ─── سجادة ─── */
function Rug() {
  return (
    <group position={[0, 0.01, 0.5]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.4, 48]} />
        <meshStandardMaterial color="#fda4af" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[1.0, 1.15, 48]} />
        <meshStandardMaterial color="#f472b6" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[0.6, 0.7, 48]} />
        <meshStandardMaterial color="#ec4899" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ─── الطاولة الصغيرة ─── */
function Nightstand() {
  return (
    <group position={[-3.2, 0, -0.5]}>
      <RoundedBox args={[0.5, 0.5, 0.4]} radius={0.03} position={[0, 0.25, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#3d2a5c" roughness={0.5} metalness={0.1} />
      </RoundedBox>
      <RoundedBox args={[0.42, 0.15, 0.02]} radius={0.01} position={[0, 0.28, 0.2]} castShadow>
        <meshStandardMaterial color="#4c1d95" roughness={0.4} metalness={0.15} />
      </RoundedBox>
      <mesh position={[0, 0.28, 0.22]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.2} metalness={0.8} />
      </mesh>
      <group position={[0.1, 0.55, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.15, 8]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <coneGeometry args={[0.08, 0.12, 12]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={0.6} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <pointLight position={[0, 0.12, 0]} intensity={0.2} color="#fbbf24" distance={2} />
      </group>
    </group>
  );
}
/* ─── الحوائط والأرضية ─── */
function Walls() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <MeshReflectorMaterial
          color="#1a1033"
          roughness={0.35}
          metalness={0.05}
          mirror={0.15}
          blur={[300, 100]}
          resolution={512}
        />
      </mesh>
      <mesh position={[0, 1.5, -3]} receiveShadow>
        <planeGeometry args={[8, 3]} />
        <meshStandardMaterial color="#1a1033" roughness={0.85} />
      </mesh>
      <mesh position={[-4, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#150d26" roughness={0.85} />
      </mesh>
      <mesh position={[4, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#150d26" roughness={0.85} />
      </mesh>
      <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#0f0720" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ─── لوحة على الحائط ─── */
function WallArt() {
  return (
    <group position={[-3.95, 1.8, -0.5]}>
      <RoundedBox args={[0.04, 0.6, 0.45]} radius={0.01} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#d4d4d8" roughness={0.3} metalness={0.5} />
      </RoundedBox>
      <RoundedBox args={[0.02, 0.5, 0.35]} radius={0.005} position={[0.02, 0, 0]}>
        <meshStandardMaterial color="#6366f1" roughness={0.5} />
      </RoundedBox>
    </group>
  );
}

/* ─── المشهد الرئيسي ─── */
function Room() {
  return (
    <group>
      <Walls />
      <Bed />
      <Desk />
      <WindowFrame />
      <Bookshelf />
      <Chandelier />
      <Plant />
      <Rug />
      <Nightstand />
      <WallArt />
    </group>
  );
}

/* ─── المكون الرئيسي ─── */
export default function Scene3D() {
  return (
    <div className="h-[420px] w-full overflow-hidden rounded-3xl border border-black/5 dark:border-white/10">
      <Canvas
        camera={{ position: [5.5, 3.5, 5.5], fov: 42 }}
        dpr={[1, 2]}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.25} color="#e0d4f5" />
          <directionalLight
            position={[4, 6, 3]}
            intensity={0.9}
            color="#fef3c7"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[0, 2.5, 0]} intensity={0.5} color="#fbbf24" distance={6} />
          <pointLight position={[-3, 1.5, 1]} intensity={0.3} color="#c084fc" distance={4} />
          <pointLight position={[3, 1, -2]} intensity={0.2} color="#60a5fa" distance={4} />
          <Room />
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.5}
            scale={14}
            blur={2.5}
            far={6}
          />
          <Environment preset="apartment" />
          <EffectComposer>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.5}
              radius={0.6}
            />
          </EffectComposer>
          <OrbitControls
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.8}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={3}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
