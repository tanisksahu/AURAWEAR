import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Ruler, CheckCircle, Info } from 'lucide-react';
import { useAllProducts, useStyleProfile } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Principal } from '@dfinity/principal';

const ANON_PRINCIPAL = Principal.anonymous();

interface AvatarProps {
  topColor: string;
  bottomColor: string;
}

function Avatar3D({ topColor, bottomColor }: AvatarProps) {
  const skinColor = '#c8a882';
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.48, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.15, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.5, 0.65, 0.25]} />
        <meshStandardMaterial color={topColor} roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Left Arm */}
      <mesh position={[-0.35, 1.0, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.07, 0.06, 0.6, 16]} />
        <meshStandardMaterial color={topColor} roughness={0.7} />
      </mesh>
      {/* Right Arm */}
      <mesh position={[0.35, 1.0, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.07, 0.06, 0.6, 16]} />
        <meshStandardMaterial color={topColor} roughness={0.7} />
      </mesh>
      {/* Left Hand */}
      <mesh position={[-0.42, 0.68, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      {/* Right Hand */}
      <mesh position={[0.42, 0.68, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      {/* Hips */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.48, 0.2, 0.23]} />
        <meshStandardMaterial color={bottomColor} roughness={0.7} />
      </mesh>
      {/* Left Leg */}
      <mesh position={[-0.14, 0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.09, 0.7, 16]} />
        <meshStandardMaterial color={bottomColor} roughness={0.7} />
      </mesh>
      {/* Right Leg */}
      <mesh position={[0.14, 0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.09, 0.7, 16]} />
        <meshStandardMaterial color={bottomColor} roughness={0.7} />
      </mesh>
      {/* Left Foot */}
      <mesh position={[-0.14, -0.28, 0.05]}>
        <boxGeometry args={[0.14, 0.1, 0.28]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>
      {/* Right Foot */}
      <mesh position={[0.14, -0.28, 0.05]}>
        <boxGeometry args={[0.14, 0.1, 0.28]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>
    </group>
  );
}

function getSizeRecommendation(height: number, chest: number, waist: number): { size: string; confidence: number } {
  if (height === 0 && chest === 0) return { size: 'M', confidence: 70 };
  if (chest >= 100 || waist >= 90 || height >= 185) return { size: 'XL', confidence: 92 };
  if (chest >= 92 || waist >= 82 || height >= 178) return { size: 'L', confidence: 94 };
  if (chest >= 84 || waist >= 74 || height >= 170) return { size: 'M', confidence: 96 };
  return { size: 'S', confidence: 93 };
}

const CATEGORY_COLORS: Record<string, string> = {
  'Tops': '#2a4a7a',
  'Bottoms': '#4a3a2a',
  'Outerwear': '#1a3a1a',
  'Accessories': '#4a3a1a',
  'Footwear': '#2a2a2a',
};

export default function VirtualTryOnPage() {
  const { data: products, isLoading } = useAllProducts();
  const { data: profile } = useStyleProfile(ANON_PRINCIPAL);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const selectedProduct = products?.find(p => p.id.toString() === selectedProductId);

  const topColor =
    selectedProduct?.category === 'Tops' || selectedProduct?.category === 'Outerwear'
      ? CATEGORY_COLORS[selectedProduct.category]
      : '#2a4a7a';
  const bottomColor =
    selectedProduct?.category === 'Bottoms' ? CATEGORY_COLORS['Bottoms'] : '#3a3a3a';

  const measurements = profile?.bodyMeasurements;
  const height = measurements ? Number(measurements.height) : 0;
  const chest = measurements ? Number(measurements.chest) : 0;
  const waist = measurements ? Number(measurements.waist) : 0;

  const { size, confidence } = getSizeRecommendation(height, chest, waist);

  const returnRisk = confidence >= 90 ? 'Low' : confidence >= 80 ? 'Medium' : 'High';
  const returnRiskColor =
    returnRisk === 'Low' ? '#22c55e' : returnRisk === 'Medium' ? '#f5a623' : '#ef4444';

  return (
    <div className="min-h-screen pt-20" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div
        className="py-12 px-6 text-center"
        style={{
          background: 'linear-gradient(to bottom, rgba(245,166,35,0.04), transparent)',
          borderBottom: '1px solid rgba(245,166,35,0.08)',
        }}
      >
        <span className="tag-chip mb-4 inline-block">Virtual Try-On</span>
        <h1 className="section-title mb-3" style={{ color: '#f5f5f5' }}>
          See It Before You <span className="gold-gradient">Buy It</span>
        </h1>
        <p style={{ color: '#666' }}>
          3D avatar simulation with AI size prediction and returns probability score.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Canvas */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                height: '500px',
                background: '#0d0d0d',
                border: '1px solid rgba(245,166,35,0.15)',
                boxShadow: '0 0 40px rgba(245,166,35,0.05)',
              }}
            >
              <Canvas camera={{ position: [0, 1, 3.5], fov: 45 }}>
                <color attach="background" args={['#0d0d0d']} />
                <ambientLight intensity={0.4} />
                <directionalLight position={[2, 4, 2]} intensity={1.2} color="#ffffff" />
                <directionalLight position={[-2, 2, -2]} intensity={0.4} color="#f5a623" />
                <pointLight position={[0, 3, 0]} intensity={0.5} color="#f5a623" />
                <Suspense fallback={null}>
                  <Avatar3D topColor={topColor} bottomColor={bottomColor} />
                  <OrbitControls
                    enablePan={false}
                    minDistance={2}
                    maxDistance={6}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 1.5}
                  />
                </Suspense>
              </Canvas>
            </div>
            <p className="text-center text-xs mt-3" style={{ color: '#444' }}>
              Drag to rotate • Scroll to zoom
            </p>

            {/* Product Selector */}
            <div className="mt-6 glass-card rounded-2xl p-5">
              <label className="block text-sm font-semibold mb-3" style={{ color: '#f5f5f5' }}>
                Select a Product to Try On
              </label>
              {isLoading ? (
                <Skeleton className="h-12 w-full rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
              ) : (
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f5f5f5',
                  }}
                >
                  <option value="" style={{ background: '#1a1a1a' }}>
                    — Choose a product —
                  </option>
                  {products?.map(p => (
                    <option key={p.id.toString()} value={p.id.toString()} style={{ background: '#1a1a1a' }}>
                      {p.name} — ₹{Number(p.price).toLocaleString('en-IN')} ({p.category})
                    </option>
                  ))}
                </select>
              )}
              {selectedProduct && (
                <div className="mt-4 flex items-center gap-4 p-3 rounded-xl" style={{ background: 'rgba(245,166,35,0.06)' }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#f5f5f5' }}>{selectedProduct.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#f5a623' }}>
                      ₹{Number(selectedProduct.price).toLocaleString('en-IN')} · {selectedProduct.category}
                    </p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {selectedProduct.tags.map(tag => (
                        <span key={tag} className="tag-chip">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Panels */}
          <div className="space-y-6">
            {/* Size Recommendation */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Ruler size={18} style={{ color: '#f5a623' }} />
                <h3 className="font-bold" style={{ color: '#f5f5f5' }}>Size Recommendation</h3>
              </div>
              {!profile ? (
                <div className="text-center py-4">
                  <Info size={24} className="mx-auto mb-2" style={{ color: 'rgba(245,166,35,0.4)' }} />
                  <p className="text-xs" style={{ color: '#666' }}>
                    Save your measurements in AI Studio to get personalized size recommendations.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div
                      className="text-5xl font-bold mb-1"
                      style={{
                        background: 'linear-gradient(135deg, #f5a623, #f7c56a)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {size}
                    </div>
                    <p className="text-xs" style={{ color: '#888' }}>Recommended Size</p>
                  </div>
                  <div
                    className="rounded-xl p-3 text-center"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <p className="text-xs font-semibold mb-1" style={{ color: '#888' }}>Fit Confidence</p>
                    <p className="text-2xl font-bold" style={{ color: '#22c55e' }}>{confidence}%</p>
                  </div>
                  <div className="space-y-2 text-xs" style={{ color: '#666' }}>
                    <div className="flex justify-between">
                      <span>Height</span>
                      <span style={{ color: '#f5f5f5' }}>{height}cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chest</span>
                      <span style={{ color: '#f5f5f5' }}>{chest}cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waist</span>
                      <span style={{ color: '#f5f5f5' }}>{waist}cm</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Returns Probability */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={18} style={{ color: '#f5a623' }} />
                <h3 className="font-bold" style={{ color: '#f5f5f5' }}>Returns Probability</h3>
              </div>
              <div className="text-center space-y-3">
                <div
                  className="text-3xl font-bold"
                  style={{ color: returnRiskColor }}
                >
                  {returnRisk} Risk
                </div>
                <div
                  className="rounded-xl p-3"
                  style={{ background: `${returnRiskColor}15`, border: `1px solid ${returnRiskColor}30` }}
                >
                  <p className="text-sm font-semibold" style={{ color: returnRiskColor }}>
                    {confidence}% Fit Confidence
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#888' }}>
                    {returnRisk === 'Low'
                      ? 'Excellent size match based on your measurements.'
                      : returnRisk === 'Medium'
                      ? 'Good match. Consider checking size chart.'
                      : 'Size mismatch likely. Review measurements.'}
                  </p>
                </div>
                <div className="space-y-2">
                  {['Fit Score', 'Style Match', 'Size Accuracy'].map((label, i) => {
                    const val = [confidence, confidence - 3, confidence + 2][i];
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: '#888' }}>{label}</span>
                          <span style={{ color: '#f5f5f5' }}>{Math.min(val, 99)}%</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(val, 99)}%`,
                              background: 'linear-gradient(90deg, #f5a623, #f7c56a)',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Feature illustration */}
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(245,166,35,0.1)' }}>
              <img
                src="/assets/generated/feature-try-on.dim_600x400.png"
                alt="Virtual Try-On"
                className="w-full object-cover opacity-70"
                style={{ maxHeight: '160px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
