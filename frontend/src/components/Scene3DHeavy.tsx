import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, MeshDistortMaterial, RoundedBox } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

function Room() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#1a1030" />
      </mesh>
      <mesh position={[0, 2.5, -4]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#150d28" />
      </mesh>

      <RoundedBox args={[3, 0.4, 2]} radius={0.05} position={[0, -0.8, -1]}>
        <meshStandardMaterial color="#2d1b69" />
      </RoundedBox>
      <RoundedBox args={[2.8, 0.15, 1.8]} radius={0.03} position={[0, -0.55, -1]}>
        <meshStandardMaterial color="#3b2299" />
      </RoundedBox>
      <RoundedBox args={[2.6, 0.1, 1.6]} radius={0.02} position={[0, -0.4, -1]}>
        <meshStandardMaterial color="#1e1145" />
      </RoundedBox>

      <RoundedBox args={[2.8, 0.6, 0.15]} radius={0.05} position={[0, 0.2, -1.85]}>
        <meshStandardMaterial color="#2d1b69" />
      </RoundedBox>

      <RoundedBox args={[1.5, 0.8, 0.8]} radius={0.08} position={[-3.2, -0.7, 0]}>
        <meshStandardMaterial color="#1e1145" />
      </RoundedBox>
      <RoundedBox args={[1.3, 0.05, 0.7]} radius={0.02} position={[-3.2, -0.25, 0]}>
        <meshStandardMaterial color="#3b2299" />
      </RoundedBox>
      <RoundedBox args={[0.6, 0.4, 0.4]} radius={0.05} position={[-3.2, -0.5, 0]}>
        <meshStandardMaterial color="#4c1d95" />
      </RoundedBox>

      <RoundedBox args={[1.2, 1.8, 0.1]} radius={0.05} position={[3.5, 0, -2]}>
        <meshStandardMaterial color="#1e1145" />
      </RoundedBox>
      {[0, 1, 2, 3].map((i) => (
        <RoundedBox key={i} args={[0.35, 0.5, 0.3]} radius={0.03} position={[3.5, 0.5 - i * 0.55, -2]}>
          <meshStandardMaterial color={['#7c3aed', '#a855f7', '#c084fc', '#e879f9'][i]} />
        </RoundedBox>
      ))}

      <RoundedBox args={[2, 1.5, 0.1]} radius={0.05} position={[0, 0.5, -3.95]}>
        <meshStandardMaterial color="#0f0520" />
      </RoundedBox>
      <mesh position={[0, 0.5, -3.9]}>
        <planeGeometry args={[1.8, 1.3]} />
        <meshStandardMaterial color="#1a0a30" emissive="#7c3aed" emissiveIntensity={0.1} />
      </mesh>

      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={`curtain-${i}`} position={[-2 + i * 1, 1.5, -3.85]}>
          <cylinderGeometry args={[0.08, 0.12, 3, 8]} />
          <meshStandardMaterial color="#4c1d95" transparent opacity={0.6} />
        </mesh>
      ))}

      <group position={[2.5, -0.5, 1]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 1.2, 8]} />
          <meshStandardMaterial color="#1e1145" />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Float key={i} speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh position={[Math.sin(i * 1.05) * 0.4, 0.6 + Math.random() * 0.4, Math.cos(i * 1.05) * 0.4]}>
              <sphereGeometry args={[0.08 + Math.random() * 0.06, 8, 8]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#22c55e' : '#16a34a'} />
            </mesh>
          </Float>
        ))}
      </group>

      <mesh position={[0, -1.45, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#2d1b69" />
      </mesh>

      <group position={[0, 2.3, 0]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <meshStandardMaterial color="#c084fc" />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[Math.sin(i * 1.05) * 0.3, -0.3, Math.cos(i * 1.05) * 0.3]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
          </mesh>
        ))}
      </group>

      <RoundedBox args={[0.8, 0.5, 0.05]} radius={0.03} position={[-2, 0.8, -3.9]}>
        <meshStandardMaterial color="#1e1145" />
      </RoundedBox>
      <mesh position={[-2, 0.8, -3.87]}>
        <planeGeometry args={[0.6, 0.35]} />
        <MeshDistortMaterial color="#7c3aed" distort={0.1} speed={2} />
      </mesh>

      <RoundedBox args={[1, 0.5, 0.5]} radius={0.08} position={[2, -1.1, 0.5]}>
        <meshStandardMaterial color="#1e1145" />
      </RoundedBox>

      <RoundedBox args={[0.8, 0.1, 0.5]} radius={0.02} position={[2, -0.8, 0.5]}>
        <meshStandardMaterial color="#3b2299" />
      </RoundedBox>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 2.5, 0]} intensity={1} color="#c084fc" />
      <pointLight position={[-3, 1, 0]} intensity={0.5} color="#a855f7" />
      <pointLight position={[3, 1, 0]} intensity={0.5} color="#ec4899" />
      <spotLight position={[0, 4, 0]} angle={0.5} penumbra={0.5} intensity={0.8} color="#fbbf24" />
    </>
  );
}

export default function Scene3DHeavy() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white/90 mb-4">
            استكشف{' '}
            <span className="bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
              السكن ثلاثي الأبعاد
            </span>
          </h2>
          <p className="text-purple-300/50">تجربة تفاعلية لاستكشاف غرفة السكن</p>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-purple-500/10 bg-[#0a0514]">
          <div className="h-[400px] md:h-[500px]">
            <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
              <fog attach="fog" args={['#0a0514', 5, 15]} />
              <Lights />
              <Room />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 2.2}
                minPolarAngle={Math.PI / 4}
              />
              <Environment preset="night" />
              <EffectComposer>
                <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={0.5} />
              </EffectComposer>
            </Canvas>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-center">
            <div className="px-4 py-2 rounded-full bg-purple-500/10 backdrop-blur-xl text-purple-300/60 text-sm">
              اسحب للتدوير · تجربة تفاعلية ثلاثية الأبعاد
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
