import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Shirt, Package } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import {
  useWardrobe,
  useAddWardrobeItem,
  useRemoveWardrobeItem,
  useWardrobeSuggestions,
} from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Principal } from '@dfinity/principal';

const ANON_PRINCIPAL = Principal.anonymous();

const CATEGORIES = ['Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Footwear'];
const COLORS = ['Black', 'White', 'Grey', 'Navy', 'Blue', 'Brown', 'Khaki', 'Red', 'Green', 'Gold', 'Beige'];

const CATEGORY_ICONS: Record<string, string> = {
  'Tops': '👕',
  'Bottoms': '👖',
  'Outerwear': '🧥',
  'Accessories': '💍',
  'Footwear': '👟',
};

const COLOR_SWATCHES: Record<string, string> = {
  'Black': '#1a1a1a',
  'White': '#f5f5f5',
  'Grey': '#888888',
  'Navy': '#1a2a4a',
  'Blue': '#2563eb',
  'Brown': '#7c4a2a',
  'Khaki': '#c4a882',
  'Red': '#dc2626',
  'Green': '#16a34a',
  'Gold': '#f5a623',
  'Beige': '#d4b896',
};

function generateOutfitCombinations(wardrobeItems: { category: string; color: string; customName?: string }[]) {
  const byCategory: Record<string, typeof wardrobeItems> = {};
  wardrobeItems.forEach(item => {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  });

  const combos: { items: typeof wardrobeItems; name: string }[] = [];
  const tops = byCategory['Tops'] || [];
  const bottoms = byCategory['Bottoms'] || [];
  const outerwear = byCategory['Outerwear'] || [];
  const accessories = byCategory['Accessories'] || [];
  const footwear = byCategory['Footwear'] || [];

  const outfitNames = ['Casual Day Out', 'Street Style', 'Smart Casual', 'Weekend Vibes', 'Urban Explorer', 'Minimal Chic', 'Bold Statement'];

  let nameIdx = 0;
  for (let t = 0; t < Math.min(tops.length, 3); t++) {
    for (let b = 0; b < Math.min(bottoms.length, 3); b++) {
      const combo: typeof wardrobeItems = [tops[t], bottoms[b]];
      if (outerwear.length > 0) combo.push(outerwear[t % outerwear.length]);
      if (footwear.length > 0) combo.push(footwear[b % footwear.length]);
      if (accessories.length > 0) combo.push(accessories[0]);
      combos.push({ items: combo, name: outfitNames[nameIdx % outfitNames.length] });
      nameIdx++;
      if (combos.length >= 6) break;
    }
    if (combos.length >= 6) break;
  }

  return combos;
}

export default function WardrobeOptimizerPage() {
  const { data: wardrobe, isLoading: wardrobeLoading } = useWardrobe(ANON_PRINCIPAL);
  const { data: suggestions, isLoading: suggestionsLoading, refetch: refetchSuggestions } = useWardrobeSuggestions(ANON_PRINCIPAL);
  const addItem = useAddWardrobeItem();
  const removeItem = useRemoveWardrobeItem();

  const [category, setCategory] = useState('Tops');
  const [color, setColor] = useState('Black');
  const [customName, setCustomName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddItem = async () => {
    await addItem.mutateAsync({
      userId: ANON_PRINCIPAL,
      item: {
        category,
        color,
        customName: customName || undefined,
        productId: undefined,
      },
    });
    setCustomName('');
  };

  const handleOptimize = async () => {
    await refetchSuggestions();
    setShowSuggestions(true);
  };

  const outfitCombos = wardrobe ? generateOutfitCombinations(
    wardrobe.map(item => ({
      category: item.category,
      color: item.color,
      customName: item.customName,
    }))
  ) : [];

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
        <span className="tag-chip mb-4 inline-block">Wardrobe Optimizer</span>
        <h1 className="section-title mb-3" style={{ color: '#f5f5f5' }}>
          Smart <span className="gold-gradient">Wardrobe AI</span>
        </h1>
        <p style={{ color: '#666' }}>
          Upload your wardrobe. AI identifies gaps and creates outfit combinations.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Add Item Form */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: '#f5f5f5' }}>
            <Plus size={18} style={{ color: '#f5a623' }} />
            Add Wardrobe Item
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: '#888' }}>Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f5f5f5',
                }}
              >
                {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#1a1a1a' }}>{c}</option>)}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: '#888' }}>Color</label>
              <select
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f5f5f5',
                }}
              >
                {COLORS.map(c => <option key={c} value={c} style={{ background: '#1a1a1a' }}>{c}</option>)}
              </select>
            </div>

            {/* Custom Name */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: '#888' }}>Item Name (optional)</label>
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder="e.g. My favorite hoodie"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f5f5f5',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.4)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>

            {/* Add Button */}
            <div className="flex items-end">
              <button
                onClick={handleAddItem}
                disabled={addItem.isPending}
                className="w-full py-3 rounded-xl font-bold text-sm tracking-wide gold-btn flex items-center justify-center gap-2"
              >
                {addItem.isPending ? <span className="animate-spin">⟳</span> : <Plus size={16} />}
                Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Current Wardrobe */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#f5f5f5' }}>
              <Shirt size={18} style={{ color: '#f5a623' }} />
              My Wardrobe
              {wardrobe && (
                <span
                  className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(245,166,35,0.15)', color: '#f5a623' }}
                >
                  {wardrobe.length} items
                </span>
              )}
            </h2>
            <button
              onClick={handleOptimize}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide gold-btn"
            >
              <Sparkles size={14} />
              Optimize My Wardrobe
            </button>
          </div>

          {wardrobeLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
              ))}
            </div>
          ) : !wardrobe || wardrobe.length === 0 ? (
            <div className="text-center py-12">
              <Package size={40} className="mx-auto mb-3" style={{ color: 'rgba(245,166,35,0.3)' }} />
              <p style={{ color: '#666' }}>Your wardrobe is empty. Add some items above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {wardrobe.map((item, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl p-4 flex flex-col items-center gap-2 group"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg"
                    style={{
                      background: COLOR_SWATCHES[item.color] || '#888',
                      borderColor: 'rgba(255,255,255,0.15)',
                    }}
                  >
                    {CATEGORY_ICONS[item.category] || '👔'}
                  </div>
                  <p className="text-xs font-semibold text-center" style={{ color: '#f5f5f5' }}>
                    {item.customName || item.category}
                  </p>
                  <p className="text-xs" style={{ color: '#666' }}>{item.color}</p>
                  <button
                    onClick={() => removeItem.mutate({ userId: ANON_PRINCIPAL, index: BigInt(idx) })}
                    className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: '#666' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wardrobe Suggestions */}
        {showSuggestions && (
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: '#f5f5f5' }}>
              <Sparkles size={18} style={{ color: '#f5a623' }} />
              AI Wardrobe Suggestions
            </h2>
            {suggestionsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
                ))}
              </div>
            ) : !suggestions || suggestions.length === 0 ? (
              <div className="text-center py-8">
                <p style={{ color: '#666' }}>
                  Your wardrobe is well-balanced! No missing categories detected.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestions.map(product => (
                  <ProductCard key={product.id.toString()} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Outfit Combinations */}
        {wardrobe && wardrobe.length >= 2 && (
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: '#f5f5f5' }}>
              <Shirt size={18} style={{ color: '#f5a623' }} />
              Outfit Combinations
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(245,166,35,0.15)', color: '#f5a623' }}
              >
                {outfitCombos.length} looks
              </span>
            </h2>
            {outfitCombos.length === 0 ? (
              <p style={{ color: '#666' }}>
                Add items from different categories (Tops + Bottoms) to generate outfit combinations.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {outfitCombos.map((combo, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-4"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <p className="text-sm font-bold mb-3" style={{ color: '#f5a623' }}>
                      {combo.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {combo.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                          style={{ background: 'rgba(255,255,255,0.06)' }}
                        >
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{
                              background: COLOR_SWATCHES[item.color] || '#888',
                              borderColor: 'rgba(255,255,255,0.2)',
                            }}
                          />
                          <span className="text-xs" style={{ color: '#f5f5f5' }}>
                            {item.customName || item.category}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/shop"
                      className="mt-3 text-xs font-semibold flex items-center gap-1"
                      style={{ color: '#f5a623' }}
                    >
                      Shop similar →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
