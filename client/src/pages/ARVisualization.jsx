import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  View, Maximize2, Move3D, Ruler, Layers, Play, Pause, 
  RotateCcw, Sun, Droplets, Info, Smartphone, Eye
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

// AR Structure Preview Component
function RechargeStructure({ type = 'pit', scale = 1 }) {
  const getStructureGeometry = () => {
    switch (type) {
      case 'pit':
        return (
          <group>
            {/* Pit walls */}
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[2 * scale, 1 * scale, 2 * scale]} />
              <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
            </mesh>
            {/* Gravel layer */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[1.8 * scale, 0.2 * scale, 1.8 * scale]} />
              <meshStandardMaterial color="#696969" roughness={1} />
            </mesh>
            {/* Water level */}
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[1.7 * scale, 0.1 * scale, 1.7 * scale]} />
              <meshStandardMaterial color="#0ea5e9" transparent opacity={0.6} />
            </mesh>
          </group>
        );
      case 'well':
        return (
          <group>
            {/* Well cylinder */}
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.8 * scale, 0.8 * scale, 1.2 * scale, 32]} />
              <meshStandardMaterial color="#a0a0a0" roughness={0.5} />
            </mesh>
            {/* Water */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.7 * scale, 0.7 * scale, 0.4 * scale, 32]} />
              <meshStandardMaterial color="#0ea5e9" transparent opacity={0.7} />
            </mesh>
          </group>
        );
      case 'rooftop':
        return (
          <group>
            {/* Tank */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.6 * scale, 0.6 * scale, 1 * scale, 32]} />
              <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Pipe */}
            <mesh position={[0.8, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08 * scale, 0.08 * scale, 1.6 * scale, 16]} />
              <meshStandardMaterial color="#718096" metalness={0.9} />
            </mesh>
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <group>
      {getStructureGeometry()}
    </group>
  );
}

// Ground plane with grid
function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#86efac" />
      </mesh>
      <gridHelper args={[20, 20, '#22c55e', '#86efac']} />
    </group>
  );
}

// House outline for scale reference
function House() {
  return (
    <group position={[-3, 0, 0]}>
      {/* House base */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.5, 1.5, 4]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Downpipe */}
      <mesh position={[1.3, 0.75, 1.3]}>
        <cylinderGeometry args={[0.08, 0.08, 1.5, 8]} />
        <meshStandardMaterial color="#718096" metalness={0.8} />
      </mesh>
    </group>
  );
}

export default function ARVisualization() {
  const [structureType, setStructureType] = useState('pit');
  const [showPipes, setShowPipes] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waterLevel, setWaterLevel] = useState(30);
  const [showUnderground, setShowUnderground] = useState(false);
  const [scale, setScale] = useState(1);
  const [isARSupported, setIsARSupported] = useState(false);
  const [arMode, setArMode] = useState(false);

  useEffect(() => {
    // Check AR support
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then(setIsARSupported);
    }
  }, []);

  const structureTypes = [
    { id: 'pit', name: 'Recharge Pit', icon: '⬛', description: 'Underground pit with gravel filtration' },
    { id: 'well', name: 'Recharge Well', icon: '⭕', description: 'Vertical shaft to aquifer' },
    { id: 'rooftop', name: 'Rooftop Storage', icon: '🛢️', description: 'Above-ground storage tank' },
  ];

  const handleARLaunch = () => {
    if (isARSupported) {
      setArMode(true);
    } else {
      alert('AR is not supported on this device. Using 3D preview mode instead.');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <View className="w-4 h-4" />
            <span>AR Visualization</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Visualize Your <span className="gradient-text">Recharge System</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how recharge structures fit in your space with augmented reality or 3D preview.
          </p>
        </motion.div>

        {/* AR Launch Button */}
        {isARSupported && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-6"
          >
            <button
              onClick={handleARLaunch}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-lg flex items-center gap-2 mx-auto hover:shadow-lg transition-all"
            >
              <Smartphone className="w-5 h-5" />
              Launch AR Mode
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Point your camera at the ground to place the structure
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D View */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* 3D Canvas */}
              <div className="h-[500px] relative">
                <Canvas shadows>
                  <PerspectiveCamera makeDefault position={[8, 5, 8]} fov={50} />
                  <OrbitControls 
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={3}
                    maxDistance={20}
                  />
                  <ambientLight intensity={0.5} />
                  <directionalLight 
                    position={[10, 10, 5]} 
                    intensity={1} 
                    castShadow 
                    shadow-mapSize={[2048, 2048]}
                  />
                  <Environment preset="sunset" />
                  
                  <Suspense fallback={null}>
                    <Ground />
                    <House />
                    <RechargeStructure type={structureType} scale={scale} />
                    
                    {/* Pipe connection */}
                    {showPipes && (
                      <group>
                        {/* From house to structure */}
                        <mesh 
                          position={[-1.5, 0.1, 0]} 
                          rotation={[0, 0, 0]}
                        >
                          <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
                          <meshStandardMaterial color="#64748b" metalness={0.8} />
                        </mesh>
                      </group>
                    )}
                  </Suspense>
                </Canvas>

                {/* Overlay Controls */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>3D Preview</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm">
                  <p className="font-medium text-gray-700 mb-1">Legend</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                    <span>Structure</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                    <span>Water</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-3 h-3 bg-green-300" />
                    <span>Ground</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => setShowPipes(!showPipes)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      showPipes ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    Pipes
                  </button>
                  <button
                    onClick={() => setShowUnderground(!showUnderground)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      showUnderground ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Droplets className="w-4 h-4" />
                    Underground
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center gap-2"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause' : 'Animate'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Structure Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Maximize2 className="w-5 h-5" />
                Structure Type
              </h3>
              <div className="space-y-2">
                {structureTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setStructureType(type.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      structureType === type.id
                        ? 'bg-primary-100 border-2 border-primary-500'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{type.name}</p>
                        <p className="text-xs text-gray-500">{type.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Scale Control */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Ruler className="w-5 h-5" />
                Size Adjustment
              </h3>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Small</span>
                  <span className="font-medium text-primary-600">{scale.toFixed(1)}x</span>
                  <span>Large</span>
                </div>
              </div>
            </motion.div>

            {/* Water Level */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Droplets className="w-5 h-5" />
                Water Level
              </h3>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={waterLevel}
                  onChange={(e) => setWaterLevel(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Empty</span>
                  <span className="font-medium text-primary-600">{waterLevel}%</span>
                  <span>Full</span>
                </div>
              </div>
            </motion.div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-blue-50 rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">AR Visualization Tips</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use AR mode on mobile for best experience</li>
                    <li>Point at a flat surface to place structure</li>
                    <li>Pinch to resize, drag to move</li>
                    <li>Take screenshots to share your design</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
