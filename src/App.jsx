import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Experience from './components/Experience'
import './App.css'



function App() {
  return (
    <Canvas
    shadows
    camera={{ position: [5, 2, -2], fov: 50 }}
    gl={{ alpha: true }}
    style={{ background: "transparent" }}>
      <Experience/>
      <OrbitControls />
    </Canvas>
  )
}

export default App