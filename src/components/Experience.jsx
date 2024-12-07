import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Experience() {
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0.0 },
    }),
    []
  );

  const mesh = useRef();

  // Create a custom depth material for shadow mapping
  const depthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        uniform float u_time;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          modelPosition.z += sin(modelPosition.y + 4.0 * u_time * 1.0) * 0.2;
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectedPosition;
        }
      `,
      fragmentShader: `
        void main() {
          gl_FragColor = vec4(vec3(gl_FragCoord.z), 1.0);
        }
      `,
      uniforms,
    });
  }, [uniforms]);

  useFrame((state) => {
    const { clock } = state;

    // Update the animation uniform
    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
    mesh.current.customDepthMaterial.uniforms.u_time.value = clock.getElapsedTime();
  });

  return (
    <>
      <ambientLight />
      <directionalLight
        castShadow
        position={[5, 5, 5]}
        intensity={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <mesh
        ref={mesh}
        receiveShadow
        castShadow
        customDepthMaterial={depthMaterial} // Set custom depth material
      >
        <planeGeometry args={[1, 1, 32, 32]} />
        <shaderMaterial
          vertexShader={`
            uniform float u_time;

            varying vec2 vUv;

            void main() {
              vec4 modelPosition = modelMatrix * vec4(position, 1.0);
              modelPosition.z += sin(modelPosition.y + 4.0 * u_time * 1.0) * 0.2;
              vec4 viewPosition = viewMatrix * modelPosition;
              vec4 projectedPosition = projectionMatrix * viewPosition;
              gl_Position = projectedPosition;
            }
          `}
          fragmentShader={`
            void main() {
              gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
          `}
          uniforms={uniforms}
          wireframe
        />
      </mesh>
      <mesh
        receiveShadow
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.5} />
      </mesh>
    </>
  );
}

export default Experience;
