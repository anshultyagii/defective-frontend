import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Spacecraft } from './Spacecraft';
import { RocketFlame } from './RocketFlame';

interface HeroSceneProps {
  scrollProgress: number; // 0 to 1
}

const SceneContents: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const propulsionState = useMemo(() => {
    if (scrollProgress < 0.1) return 0;
    if (scrollProgress < 0.2) return THREE.MathUtils.mapLinear(scrollProgress, 0.1, 0.2, 0, 0.3);
    if (scrollProgress < 0.4) return THREE.MathUtils.mapLinear(scrollProgress, 0.2, 0.4, 0.3, 1);
    return 1;
  }, [scrollProgress]);
  
  const flameIntensity = propulsionState;
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Position Y
    let posY = 0;
    if (scrollProgress >= 0.2 && scrollProgress < 0.4) {
      posY = THREE.MathUtils.mapLinear(scrollProgress, 0.2, 0.4, 0, 2);
    } else if (scrollProgress >= 0.4 && scrollProgress < 0.7) {
      // Accelerate
      const t = (scrollProgress - 0.4) / 0.3; // 0 to 1
      posY = 2 + (t * t) * 15; // quadratic easing
    } else if (scrollProgress >= 0.7) {
      posY = 20; // out of view
    }
    
    // Rotation Z (slight tilt)
    let rotZ = 0;
    if (scrollProgress >= 0.4 && scrollProgress < 0.7) {
      rotZ = THREE.MathUtils.mapLinear(scrollProgress, 0.4, 0.7, 0, -0.1);
    }
    
    // Camera shake
    let shakeX = 0;
    let shakeY = 0;
    if (scrollProgress >= 0.3 && scrollProgress < 0.7) {
      const shakeIntensity = THREE.MathUtils.mapLinear(Math.min(scrollProgress, 0.6), 0.3, 0.6, 0, 0.1);
      shakeX = (Math.random() - 0.5) * shakeIntensity;
      shakeY = (Math.random() - 0.5) * shakeIntensity;
    }
    
    // Apply position
    groupRef.current.position.y = posY;
    groupRef.current.rotation.z = rotZ;
    
    // Camera follow and shake
    state.camera.position.x = shakeX;
    state.camera.position.y = -2 + (posY * 0.1) + shakeY; // Camera follows slightly
    state.camera.lookAt(0, posY * 0.5, 0);
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#00d8ff" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <group ref={groupRef}>
        <Spacecraft propulsionState={propulsionState} />
        {flameIntensity > 0 && <RocketFlame intensity={flameIntensity} position={[0, -2.5, 0]} />}
      </group>
      
      <fog attach="fog" args={['#050810', 10, 50]} />
    </>
  );
};

export const HeroScene: React.FC<HeroSceneProps> = React.memo(({ scrollProgress }) => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, -2, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <SceneContents scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
});

HeroScene.displayName = 'HeroScene';
