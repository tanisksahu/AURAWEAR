import React, { useState } from 'react';
import { Sparkles, ShoppingCart, ArrowRight, Calendar } from 'lucide-react';
import { useAllProducts } from '../hooks/useQueries';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../backend';

const OCCASION_KEYWORDS: Record<string, string[]> = {
  formal: ['formal', 'office', 'meeting', 'interview', 'wedding', 'dinner', 'business', 'corporate', 'taj', 'client'],
  casual: ['casual', 'weekend', 'hangout', 'chill', 'coffee', 'brunch', 'friends', 'mall', 'movie'],
  streetwear: ['fest', 'college', 'party', 'concert', 'club', 'night', 'streetwear', 'urban', 'gig'],
  luxury: ['luxury', 'gala', 'award', 'premiere', 'vip', 'lounge', 'rooftop'],
  minimal: ['minimal', 'clean', 'simple', 'everyday', 'work from home', 'wfh'],
};

function detectStyle(input: string): string {
  const lower = input.toLowerCase();
  for (const [style, keywords] of Object.entries(OCCASION_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return style;
  }
  return 'casual';
}

interface LookCard {
  name: string;
  items: Product[];
  total: number;
}

function buildLooks(products: Product[], style: string, count: number): LookCard[] {
  const byCategory: Record<string, Product[]> = {};
  products.forEach(p => {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  });

  const filterByStyle = (items: Product[]) => {
    const styled = items.filter(p => p.tags.includes(style));
    return styled.length > 0 ? styled : items;
  };

  const tops = filterByStyle(byCategory['Tops'] || []);
  const bottoms = filterByStyle(byCategory['Bottoms'] || []);
  const footwear = filterByStyle(byCategory['Footwear'] || []);
  const accessories = filterByStyle(byCategory['Accessories'] || []);
  const outerwear = filterByStyle(byCategory['Outerwear'] || []);

  const lookNames = [
    'The Statement Look',
    'The Effortless Edit',
    'The Power Move',
    'The Street Ready',
    'The Clean Slate',
  ];

  const looks: LookCard[] = [];
  for (let i = 0; i < count; i++) {
    const top = tops[i % tops.length];
    const bottom = bottoms[i % bottoms.length];
    const shoe = footwear[i % footwear.length];
    const acc = accessories[i % accessories.length];
    const outer = outerwear[i % outerwear.length];

    const items: Product[] = [];
    if (top) items.push(top);
    if (bottom) items.push(bottom);
    if (shoe) items.push(shoe);
    if (acc) items.push(acc);
    if (items.length < 4 && outer) items.push(outer);

    if (items.length >= 2) {
      looks.push({
        name: lookNames[i % lookNames.length],
        items,
        total: items.reduce((sum, p) => sum + Number(p.price), 0),
      });
    }
  }
  return looks;
}

const CATEGORY_IMAGES: Record<string, string> = {
  'Tops': '/assets/generated/product-tshirt-white.dim_600x600.png',
  'Bottoms': '/assets/generated/product-cargo-brown.dim_600x600.png',
  'Outerwear': '/assets/generated/product-hoodie-black.dim_600x600.png',
  'Accessories': '/assets/generated/product-chain-gold.dim_600x600.png',
  'Footwear': '/assets/generated/product-sneakers-white.dim_600x600.png',
};

const EXAMPLE_OCCASIONS = [
  'I have a college fest next week',
  'Client dinner at a fancy restaurant',
  'Casual weekend brunch with friends',
  'Job interview at a startup',
];

export default function SmartOccasionPage() {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [looks, setLooks] = useState<LookCard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: products } = useAllProducts();
  const { addToCart } = useCart();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !products || products.length === 0) return;
    setIsGenerating(true);
    setSubmitted(input.trim());

    setTimeout(() => {
      const style = detectStyle(input);
      const generatedLooks = buildLooks(products, style, 3);
      setLooks(generatedLooks);
      setIsGenerating(false);
    }, 800);
  };

  const handleAddFullLook = (look: LookCard) => {
    look.items.forEach(product => {
      addToCart({
        id: product.id.toString(),
        name: product.name,
        imageUrl: product.imageUrl,
        price: Number(product.price),
        category: product.category,
      });
    });
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

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
        <span className="tag-chip mb-4 inline-block">Smart Occasion Agent</span>
        <h1 className="section-title mb-3" style={{ color: '#f5f5f5' }}>
          What's the <span className="gold-gradient">Occasion?</span>
        </h1>
        <p style={{ color: '#666' }}>
          Tell our AI where you're going. Get 3 complete outfit suggestions instantly.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Input */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: '#666' }}
              />
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
                placeholder='e.g. "I have a college fest next week"'
                className="w-full pl-12 pr-4 py-4 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f5f5f5',
                  fontSize: '1rem',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.4)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>

            {/* Example chips */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs" style={{ color: '#555', alignSelf: 'center' }}>Try:</span>
              {EXAMPLE_OCCASIONS.map(ex => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => handleExampleClick(ex)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#888',
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="w-full py-4 rounded-xl font-bold text-sm tracking-wider gold-btn flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Generating Outfits...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Get Outfit Suggestions
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {submitted && !isGenerating && looks.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles size={18} style={{ color: '#f5a623' }} />
              <h2 className="text-lg font-bold" style={{ color: '#f5f5f5' }}>
                3 Looks for "{submitted}"
              </h2>
            </div>

            <div className="space-y-6">
              {looks.map((look, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  {/* Look Header */}
                  <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom: '1px solid rgba(245,166,35,0.08)' }}
                  >
                    <div>
                      <span
                        className="text-xs font-bold tracking-widest uppercase mr-3"
                        style={{ color: '#f5a623' }}
                      >
                        Look {idx + 1}
                      </span>
                      <span className="font-bold" style={{ color: '#f5f5f5' }}>
                        {look.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs" style={{ color: '#666' }}>Total</p>
                        <p className="font-bold" style={{ color: '#f5a623' }}>
                          ₹{look.total.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddFullLook(look)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs tracking-wide gold-btn"
                      >
                        <ShoppingCart size={12} />
                        Add Full Look
                      </button>
                    </div>
                  </div>

                  {/* Items Grid */}
                  <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {look.items.map(product => (
                      <div
                        key={product.id.toString()}
                        className="rounded-xl overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <div className="relative" style={{ aspectRatio: '1/1', background: '#141414' }}>
                          <img
                            src={CATEGORY_IMAGES[product.category] || '/assets/generated/product-hoodie-black.dim_600x600.png'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          <div
                            className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs"
                            style={{ background: 'rgba(10,10,10,0.8)', color: '#888' }}
                          >
                            {product.category}
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-semibold leading-tight mb-1" style={{ color: '#f5f5f5' }}>
                            {product.name}
                          </p>
                          <p className="text-xs font-bold" style={{ color: '#f5a623' }}>
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {submitted && !isGenerating && looks.length === 0 && (
          <div className="text-center py-16 glass-card rounded-2xl">
            <Sparkles size={48} className="mx-auto mb-4" style={{ color: 'rgba(245,166,35,0.3)' }} />
            <p style={{ color: '#666' }}>
              Couldn't generate looks. Make sure the product catalog is loaded.
            </p>
          </div>
        )}

        {!submitted && (
          <div className="text-center py-16">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)' }}
            >
              <Calendar size={32} style={{ color: 'rgba(245,166,35,0.5)' }} />
            </div>
            <p className="text-lg font-semibold mb-2" style={{ color: '#f5f5f5' }}>
              Describe your occasion above
            </p>
            <p style={{ color: '#555' }}>
              Our AI will curate 3 complete outfit looks just for you.
            </p>
            <div className="flex items-center justify-center gap-2 mt-6" style={{ color: '#444' }}>
              <ArrowRight size={14} />
              <span className="text-sm">Includes top, bottom, footwear & accessories</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
