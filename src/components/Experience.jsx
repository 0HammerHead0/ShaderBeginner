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

        varying float vHeight;
        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vHeight = modelPosition.y;
          float t = clamp(vHeight, -0.5, 0.5); // Assuming the geometry's Y-bounds are -0.5 to 0.5
          t = (t + 0.5); // Normalize to 0.0 to 1.0 range

          modelPosition.z += sin(modelPosition.y * 2.0 + 4.0 * u_time * 1.0) * 0.2 * (1.0-t);
              modelPosition.z += cos(modelPosition.x * 5.0 + 4.0 * u_time * 1.0) * (1.0-t) * 0.1;
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
            varying float vHeight;
            void main() {
              vec4 modelPosition = modelMatrix * vec4(position, 1.0);
              vHeight = modelPosition.y;
              float t = clamp(vHeight, -0.5, 0.5); // Assuming the geometry's Y-bounds are -0.5 to 0.5
              t = (t + 0.5); // Normalize to 0.0 to 1.0 range

              modelPosition.z += sin(modelPosition.y * 2.0 + 4.0 * u_time * 1.0) * 0.2 * (1.0-t);
              modelPosition.z += cos(modelPosition.x * 5.0 + 4.0 * u_time * 1.0) * (1.0-t) * 0.1;
              vec4 viewPosition = viewMatrix * modelPosition;
              vec4 projectedPosition = projectionMatrix * viewPosition;
              gl_Position = projectedPosition;
            }
          `}
          fragmentShader={`
            varying float vHeight;

            void main() {
              // Map height to a range between 0.0 and 1.0
              float t = clamp(vHeight, -0.5, 0.5); // Assuming the geometry's Y-bounds are -0.5 to 0.5
              t = (t + 0.5); // Normalize to 0.0 to 1.0 range

              // Interpolate between red and blue
              vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), t);

              gl_FragColor = vec4(color, 1.0);
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
