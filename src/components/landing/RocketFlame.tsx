import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RocketFlameProps {
  intensity?: number; // 0 to 1
  position?: [number, number, number];
  scale?: [number, number, number];
}

export const RocketFlame: React.FC<RocketFlameProps> = ({
  intensity = 0,
  position = [0, -2.5, 0],
  scale = [1, 1, 1],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const materials = useMemo(() => {
    return {
      core: new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      outer: new THREE.MeshBasicMaterial({
        color: '#ff7700',
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Scale and opacity based on intensity
    const flameScale = intensity * (1 + Math.random() * 0.1); // Add slight flicker
    groupRef.current.scale.set(scale[0], scale[1] * flameScale, scale[2]);
    
    if (coreRef.current && outerRef.current && lightRef.current) {
      const coreMat = coreRef.current.material as THREE.MeshBasicMaterial;
      const outerMat = outerRef.current.material as THREE.MeshBasicMaterial;
      
      coreMat.opacity = intensity * 0.9 * (0.9 + Math.random() * 0.2);
      outerMat.opacity = intensity * 0.6 * (0.8 + Math.random() * 0.4);
      
      lightRef.current.intensity = intensity * 5;
    }
    
    // Slight random movement
    groupRef.current.position.x = position[0] + (Math.random() - 0.5) * 0.02 * intensity;
    groupRef.current.position.z = position[2] + (Math.random() - 0.5) * 0.02 * intensity;
  });

  return (
    <group ref={groupRef} position={position} rotation={[Math.PI, 0, 0]}>
      {/* Light Source */}
      <pointLight ref={lightRef} color="#ffaa00" distance={10} decay={2} />
      
      {/* Outer Flame */}
      <mesh ref={outerRef} material={materials.outer} position={[0, 1.5, 0]}>
        <coneGeometry args={[0.6, 3, 32]} />
      </mesh>
      
      {/* Inner Core Flame */}
      <mesh ref={coreRef} material={materials.core} position={[0, 1, 0]}>
        <coneGeometry args={[0.3, 2, 32]} />
      </mesh>
      
      {/* Particles (simplified as small spheres) */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh 
          key={`particle-${i}`} 
          position={[
            (Math.random() - 0.5) * 0.5, 
            2 + Math.random() * 2, 
            (Math.random() - 0.5) * 0.5
          ]}
          material={materials.outer}
        >
          <sphereGeometry args={[0.05 + Math.random() * 0.05, 8, 8]} />
        </mesh>
      ))}
    </group>
  );
};
