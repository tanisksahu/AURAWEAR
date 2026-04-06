import React, { useState } from 'react';
import { Brain, Shirt, TrendingUp, Sparkles, Save, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useStyleProfile,
  useCreateOrUpdateStyleProfile,
  useRemoveSavedOutfit,
  usePersonalizedTrends,
  useAllProducts,
} from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Principal } from '@dfinity/principal';

const ANON_PRINCIPAL = Principal.anonymous();

const STYLE_PREFS = ['streetwear', 'minimal', 'luxury', 'casual', 'formal'];

const CATEGORY_IMAGES: Record<string, string> = {
  'Tops': '/assets/generated/product-tshirt-white.dim_600x600.png',
  'Bottoms': '/assets/generated/product-cargo-brown.dim_600x600.png',
  'Outerwear': '/assets/generated/product-hoodie-black.dim_600x600.png',
  'Accessories': '/assets/generated/product-chain-gold.dim_600x600.png',
  'Footwear': '/assets/generated/product-sneakers-white.dim_600x600.png',
};

export default function AIStudioPage() {
  const { data: profile, isLoading: profileLoading } = useStyleProfile(ANON_PRINCIPAL);
  const { data: trends, isLoading: trendsLoading } = usePersonalizedTrends(ANON_PRINCIPAL);
  const { data: allProducts } = useAllProducts();
  const createProfile = useCreateOrUpdateStyleProfile();
  const removeOutfit = useRemoveSavedOutfit();

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setHeight(profile.bodyMeasurements.height.toString());
      setWeight(profile.bodyMeasurements.weight.toString());
      setChest(profile.bodyMeasurements.chest.toString());
      setWaist(profile.bodyMeasurements.waist.toString());
      setHips(profile.bodyMeasurements.hips.toString());
      setSelectedPrefs(profile.stylePreferences);
    }
  }, [profile]);

  const togglePref = (pref: string) => {
    setSelectedPrefs(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleSaveProfile = async () => {
    await createProfile.mutateAsync({
      userId: ANON_PRINCIPAL,
      bodyMeasurements: {
        height: BigInt(parseInt(height) || 0),
        weight: BigInt(parseInt(weight) || 0),
        chest: BigInt(parseInt(chest) || 0),
        waist: BigInt(parseInt(waist) || 0),
        hips: BigInt(parseInt(hips) || 0),
      },
      stylePreferences: selectedPrefs,
      savedOutfits: profile?.savedOutfits ?? [],
      trendAlerts: profile?.trendAlerts ?? [],
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getProductById = (id: bigint) => allProducts?.find(p => p.id === id);

  const trendProducts = trends
    ?.map(t => allProducts?.find(p => p.id === t.productId))
    .filter(Boolean) ?? [];

  const aiSuggestions = allProducts?.filter(p =>
    selectedPrefs.length === 0
      ? p.isTrending
      : p.tags.some(tag => selectedPrefs.includes(tag))
  ).slice(0, 6) ?? [];

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
        <span className="tag-chip mb-4 inline-block">AI Studio</span>
        <h1 className="section-title mb-3" style={{ color: '#f5f5f5' }}>
          Your <span className="gold-gradient">Style Intelligence</span> Hub
        </h1>
        <p style={{ color: '#666' }}>
          Manage your style profile, saved outfits, and AI-powered recommendations.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <Tabs defaultValue="style-twin">
          <TabsList
            className="w-full mb-8 p-1 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {[
              { value: 'style-twin', label: 'Style Twin', icon: Brain },
              { value: 'saved-outfits', label: 'Saved Outfits', icon: Shirt },
              { value: 'ai-suggestions', label: 'AI Suggestions', icon: Sparkles },
              { value: 'trend-alerts', label: 'Trend Alerts', icon: TrendingUp },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold tracking-wide py-2.5 rounded-lg transition-all duration-200 data-[state=active]:text-[#0a0a0a]"
                  style={{}}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Style Twin Tab */}
          <TabsContent value="style-twin">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div className="glass-card rounded-2xl p-6 space-y-6">
                <h2 className="text-lg font-bold" style={{ color: '#f5f5f5' }}>
                  Body Measurements
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Height (cm)', value: height, setter: setHeight },
                    { label: 'Weight (kg)', value: weight, setter: setWeight },
                    { label: 'Chest (cm)', value: chest, setter: setChest },
                    { label: 'Waist (cm)', value: waist, setter: setWaist },
                    { label: 'Hips (cm)', value: hips, setter: setHips },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="block text-xs font-semibold mb-2" style={{ color: '#888' }}>
                        {field.label}
                      </label>
                      <input
                        type="number"
                        value={field.value}
                        onChange={e => field.setter(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#f5f5f5',
                        }}
                        onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.4)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-sm font-bold mb-3" style={{ color: '#f5f5f5' }}>
                    Style Preferences
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {STYLE_PREFS.map(pref => (
                      <label
                        key={pref}
                        className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl transition-all duration-200"
                        style={{
                          background: selectedPrefs.includes(pref) ? 'rgba(245,166,35,0.12)' : 'rgba(255,255,255,0.04)',
                          border: selectedPrefs.includes(pref) ? '1px solid rgba(245,166,35,0.3)' : '1px solid rgba(255,255,255,0.08)',
                          color: selectedPrefs.includes(pref) ? '#f5a623' : '#888',
                        }}
                      >
                        <Checkbox
                          checked={selectedPrefs.includes(pref)}
                          onCheckedChange={() => togglePref(pref)}
                          className="border-current"
                        />
                        <span className="text-sm font-medium capitalize">{pref}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={createProfile.isPending}
                  className="w-full py-3 rounded-xl font-bold text-sm tracking-wide gold-btn flex items-center justify-center gap-2"
                >
                  {createProfile.isPending ? (
                    <span className="animate-spin">⟳</span>
                  ) : saveSuccess ? (
                    <><CheckCircle size={16} /> Saved!</>
                  ) : (
                    <><Save size={16} /> Save Style Profile</>
                  )}
                </button>

                {createProfile.isError && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#ef4444' }}>
                    <AlertCircle size={14} />
                    Failed to save profile. Please try again.
                  </div>
                )}
              </div>

              {/* Current Profile Display */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-6" style={{ color: '#f5f5f5' }}>
                  Your Style Profile
                </h2>
                {profileLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    ))}
                  </div>
                ) : profile ? (
                  <div className="space-y-4">
                    <div
                      className="grid grid-cols-2 gap-3 p-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      {[
                        { label: 'Height', value: `${profile.bodyMeasurements.height}cm` },
                        { label: 'Weight', value: `${profile.bodyMeasurements.weight}kg` },
                        { label: 'Chest', value: `${profile.bodyMeasurements.chest}cm` },
                        { label: 'Waist', value: `${profile.bodyMeasurements.waist}cm` },
                        { label: 'Hips', value: `${profile.bodyMeasurements.hips}cm` },
                      ].map(m => (
                        <div key={m.label}>
                          <p className="text-xs" style={{ color: '#666' }}>{m.label}</p>
                          <p className="font-semibold" style={{ color: '#f5f5f5' }}>{m.value}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: '#888' }}>Style Preferences</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.stylePreferences.length > 0 ? (
                          profile.stylePreferences.map(pref => (
                            <span key={pref} className="tag-chip">{pref}</span>
                          ))
                        ) : (
                          <span style={{ color: '#555', fontSize: '0.8rem' }}>No preferences set</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#888' }}>Saved Outfits</p>
                      <p className="font-bold text-2xl" style={{ color: '#f5a623' }}>
                        {profile.savedOutfits.length}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain size={40} className="mx-auto mb-3" style={{ color: 'rgba(245,166,35,0.3)' }} />
                    <p style={{ color: '#666' }}>No profile yet. Fill in your details and save!</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Saved Outfits Tab */}
          <TabsContent value="saved-outfits">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-6" style={{ color: '#f5f5f5' }}>
                Saved Outfits
              </h2>
              {profileLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  ))}
                </div>
              ) : !profile || profile.savedOutfits.length === 0 ? (
                <div className="text-center py-16">
                  <Shirt size={48} className="mx-auto mb-4" style={{ color: 'rgba(245,166,35,0.3)' }} />
                  <p style={{ color: '#666' }}>No saved outfits yet.</p>
                  <p className="text-sm mt-1" style={{ color: '#444' }}>
                    Browse the shop and save your favorite looks!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.savedOutfits.map((outfit, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl p-4"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold" style={{ color: '#f5f5f5' }}>
                          Outfit #{idx + 1}
                        </span>
                        <button
                          onClick={() => removeOutfit.mutate({ userId: ANON_PRINCIPAL, index: BigInt(idx) })}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: '#666' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {outfit.items.map(itemId => {
                          const product = getProductById(itemId);
                          return product ? (
                            <div key={itemId.toString()} className="flex items-center gap-2">
                              <img
                                src={CATEGORY_IMAGES[product.category] || '/assets/generated/product-hoodie-black.dim_600x600.png'}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg"
                                style={{ background: '#1a1a1a' }}
                              />
                              <div>
                                <p className="text-xs font-medium" style={{ color: '#f5f5f5' }}>{product.name}</p>
                                <p className="text-xs" style={{ color: '#f5a623' }}>₹{Number(product.price).toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          ) : (
                            <span key={itemId.toString()} className="text-xs" style={{ color: '#555' }}>
                              Item #{itemId.toString()}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* AI Suggestions Tab */}
          <TabsContent value="ai-suggestions">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles size={20} style={{ color: '#f5a623' }} />
                <h2 className="text-lg font-bold" style={{ color: '#f5f5f5' }}>
                  Personalized for You
                </h2>
              </div>
              {aiSuggestions.length === 0 ? (
                <div className="text-center py-16 glass-card rounded-2xl">
                  <Sparkles size={48} className="mx-auto mb-4" style={{ color: 'rgba(245,166,35,0.3)' }} />
                  <p style={{ color: '#666' }}>Set your style preferences to get personalized suggestions!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiSuggestions.map(product => (
                    <ProductCard key={product.id.toString()} product={product} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Trend Alerts Tab */}
          <TabsContent value="trend-alerts">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp size={20} style={{ color: '#f5a623' }} />
                <h2 className="text-lg font-bold" style={{ color: '#f5f5f5' }}>
                  Trend Alerts
                </h2>
              </div>
              {trendsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  ))}
                </div>
              ) : trendProducts.length === 0 ? (
                <div className="text-center py-16 glass-card rounded-2xl">
                  <TrendingUp size={48} className="mx-auto mb-4" style={{ color: 'rgba(245,166,35,0.3)' }} />
                  <p style={{ color: '#666' }}>
                    {profile
                      ? 'No trending items match your style preferences yet.'
                      : 'Save your style preferences to see personalized trend alerts!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendProducts.map(product => product && (
                    <div key={product.id.toString()} className="glass-card-hover rounded-2xl overflow-hidden">
                      <div className="relative h-40" style={{ background: '#141414' }}>
                        <img
                          src={CATEGORY_IMAGES[product.category] || '/assets/generated/product-hoodie-black.dim_600x600.png'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                          style={{ background: 'rgba(245,166,35,0.9)', color: '#0a0a0a' }}
                        >
                          <TrendingUp size={10} />
                          {trends?.find(t => t.productId === product.id)?.trendScore.toString()}% HOT
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-2" style={{ color: '#f5f5f5' }}>{product.name}</h3>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {trends?.find(t => t.productId === product.id)?.trendTags.map(tag => (
                            <span key={tag} className="tag-chip">{tag}</span>
                          ))}
                        </div>
                        <p className="font-bold" style={{ color: '#f5a623' }}>
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
