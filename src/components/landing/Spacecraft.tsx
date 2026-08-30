import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpacecraftProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  propulsionState?: number; // 0 to 1
  scrollProgress?: number; // 0 to 1
}

export const Spacecraft: React.FC<SpacecraftProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  propulsionState = 0,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Materials
  const materials = useMemo(() => {
    return {
      fuselage: new THREE.MeshStandardMaterial({
        color: '#8a949e',
        metalness: 0.8,
        roughness: 0.2,
      }),
      darkMetal: new THREE.MeshStandardMaterial({
        color: '#2a2e33',
        metalness: 0.9,
        roughness: 0.3,
      }),
      emissive: new THREE.MeshStandardMaterial({
        color: '#2a2e33',
        emissive: '#00d8ff',
        emissiveIntensity: 0,
        metalness: 0.9,
        roughness: 0.3,
      }),
    };
  }, []);

  // Update emissive intensity based on propulsionState
  useFrame(() => {
    if (materials.emissive) {
      materials.emissive.emissiveIntensity = propulsionState * 2.0;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Main Fuselage */}
      <mesh position={[0, 0, 0]} material={materials.fuselage}>
        <cylinderGeometry args={[0.5, 0.5, 3, 32]} />
      </mesh>

      {/* Nose Cone */}
      <mesh position={[0, 2, 0]} material={materials.fuselage}>
        <coneGeometry args={[0.5, 1, 32]} />
      </mesh>

      {/* Engine Section (Bottom) */}
      <mesh position={[0, -1.75, 0]} material={materials.darkMetal}>
        <cylinderGeometry args={[0.5, 0.6, 0.5, 32]} />
      </mesh>

      {/* Engine Nozzle */}
      <mesh position={[0, -2.25, 0]} material={materials.emissive}>
        <cylinderGeometry args={[0.4, 0.7, 0.5, 32]} />
      </mesh>

      {/* Fins */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={`fin-${i}`} rotation={[0, (i * Math.PI) / 2, 0]}>
          <mesh position={[0.7, -1, 0]} material={materials.fuselage}>
            <boxGeometry args={[0.8, 1.5, 0.05]} />
          </mesh>
        </group>
      ))}
      
      {/* Surface Detail Panel Lines (Simplified) */}
      <mesh position={[0, 0, 0]} material={materials.darkMetal}>
        <cylinderGeometry args={[0.51, 0.51, 0.1, 32]} />
      </mesh>
      <mesh position={[0, 1, 0]} material={materials.darkMetal}>
        <cylinderGeometry args={[0.51, 0.51, 0.05, 32]} />
      </mesh>
    </group>
  );
};
