import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Sparkles, Brain, Shirt, TrendingUp, Eye, Star, Users, Zap, ChevronRight } from 'lucide-react';
import { useAllProducts, useSeedProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';

const DEMO_QUERIES = [
  'casual black oversized hoodie under ₹2500',
  'formal blazer for office meeting',
  'streetwear outfit for college fest',
];

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Style Twin',
    desc: 'Your digital fashion identity. Upload measurements, set preferences, and let AI build your evolving style profile.',
    image: '/assets/generated/feature-style-twin.dim_600x400.png',
    link: '/studio',
    color: '#f5a623',
  },
  {
    icon: Sparkles,
    title: 'Smart Occasion Agent',
    desc: 'Type any occasion and get 3 complete outfit suggestions with accessories, budget combos, and one-click cart.',
    image: null,
    link: '/occasion',
    color: '#f7c56a',
  },
  {
    icon: Shirt,
    title: 'Wardrobe Optimizer',
    desc: 'Upload your wardrobe. AI identifies gaps, creates 15+ outfit combos, and prevents duplicate purchases.',
    image: null,
    link: '/wardrobe',
    color: '#e8920f',
  },
  {
    icon: TrendingUp,
    title: 'Trend Radar',
    desc: 'Real-time trend intelligence personalized to your style DNA. Stay ahead of the curve, always.',
    image: '/assets/generated/feature-trend-radar.dim_600x400.png',
    link: '/studio',
    color: '#f5a623',
  },
  {
    icon: Eye,
    title: 'Virtual Try-On',
    desc: '3D avatar simulation with auto-size prediction and returns probability score. See it before you buy it.',
    image: '/assets/generated/feature-try-on.dim_600x400.png',
    link: '/try-on',
    color: '#f7c56a',
  },
];

const TESTIMONIALS = [
  {
    name: 'Arjun Mehta',
    role: 'Product Designer, Bangalore',
    text: 'AURAWEAR\'s AI Style Twin literally knows my vibe better than I do. It suggested a minimal capsule wardrobe that saved me ₹15,000 in impulse buys.',
    rating: 5,
    avatar: 'AM',
  },
  {
    name: 'Priya Sharma',
    role: 'Marketing Lead, Mumbai',
    text: 'The Occasion Agent is insane. I typed "client dinner at Taj" and got 3 perfect looks with accessories in 2 seconds. This is the future.',
    rating: 5,
    avatar: 'PS',
  },
  {
    name: 'Rohan Kapoor',
    role: 'Startup Founder, Delhi',
    text: 'Finally a fashion platform that gets Gen Z. The Trend Radar keeps me ahead without the noise. 10/10 would recommend.',
    rating: 5,
    avatar: 'RK',
  },
];

const STATS = [
  { value: '10,000+', label: 'Styles Generated' },
  { value: '98%', label: 'Fit Accuracy' },
  { value: '4.9★', label: 'User Rating' },
  { value: '₹2Cr+', label: 'Saved on Returns' },
];

export default function HomePage() {
  const [demoQuery, setDemoQuery] = useState('');
  const [demoResults, setDemoResults] = useState<boolean>(false);
  const [currentQueryIdx, setCurrentQueryIdx] = useState(0);
  const { data: products, isLoading } = useAllProducts();
  const seedMutation = useSeedProducts();

  useEffect(() => {
    if (!isLoading && products && products.length === 0) {
      seedMutation.mutate();
    }
  }, [isLoading, products]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQueryIdx(i => (i + 1) % DEMO_QUERIES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDemoSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoQuery.trim()) setDemoResults(true);
  };

  const featuredProducts = products?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient"
        style={{ paddingTop: '80px' }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.7) 70%, #0a0a0a 100%)',
          }}
        />

        {/* Decorative orbs */}
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #f5a623, transparent)' }}
        />
        <div
          className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #f7c56a, transparent)' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
            style={{
              background: 'rgba(245,166,35,0.1)',
              border: '1px solid rgba(245,166,35,0.3)',
              color: '#f5a623',
            }}
          >
            <Zap size={12} />
            AI-Powered Fashion Intelligence
          </div>

          <h1
            className="section-title mb-6"
            style={{ color: '#f5f5f5' }}
          >
            Meet Your{' '}
            <span className="gold-gradient">AI Stylist</span>
          </h1>

          <p
            className="text-xl md:text-2xl mb-4 font-light tracking-wide"
            style={{ color: 'rgba(245,245,245,0.7)' }}
          >
            Your Style. Your Data. Your AI.
          </p>

          <p
            className="text-base md:text-lg mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(245,245,245,0.5)' }}
          >
            Not just e-commerce. A personalized fashion intelligence platform that adapts to your personality,
            body type, lifestyle, and trends in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm tracking-wider gold-btn"
            >
              Start Your Style Journey
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm tracking-wider transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#f5f5f5',
              }}
            >
              Explore Shop
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, transparent, #f5a623)' }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: '#f5a623' }}>Scroll</span>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6" style={{ borderTop: '1px solid rgba(245,166,35,0.08)', borderBottom: '1px solid rgba(245,166,35,0.08)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center">
              <div
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(135deg, #f5a623, #f7c56a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: '#666' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="tag-chip mb-4 inline-block">Live Demo</span>
            <h2 className="section-title mb-4" style={{ color: '#f5f5f5' }}>
              Ask AI, Get Styled
            </h2>
            <p style={{ color: '#666' }}>
              Type anything. Our AI understands natural language.
            </p>
          </div>

          <div
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(245,166,35,0.15)',
              boxShadow: '0 0 40px rgba(245,166,35,0.05)',
            }}
          >
            <form onSubmit={handleDemoSearch} className="flex gap-3 mb-8">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={demoQuery}
                  onChange={e => setDemoQuery(e.target.value)}
                  placeholder={DEMO_QUERIES[currentQueryIdx]}
                  className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f5f5f5',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(245,166,35,0.4)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.08)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-4 rounded-xl font-bold text-sm tracking-wide gold-btn flex items-center gap-2"
              >
                <Sparkles size={16} />
                Ask AI
              </button>
            </form>

            {/* Demo Results */}
            {demoResults && featuredProducts.length > 0 ? (
              <div>
                <p className="text-xs mb-4 flex items-center gap-2" style={{ color: '#f5a623' }}>
                  <Sparkles size={12} />
                  AI found {featuredProducts.length} perfect matches for you
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {featuredProducts.map(product => (
                    <ProductCard key={product.id.toString()} product={product} compact />
                  ))}
                </div>
              </div>
            ) : demoResults ? (
              <div className="text-center py-8" style={{ color: '#666' }}>
                <Sparkles size={32} className="mx-auto mb-3 opacity-30" />
                <p>Loading AI recommendations...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-40 pointer-events-none">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="rounded-xl h-48"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  />
                ))}
              </div>
            )}

            {!demoResults && (
              <p className="text-center text-xs mt-4" style={{ color: '#444' }}>
                Type a query above to see AI recommendations
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="tag-chip mb-4 inline-block">Agentic AI</span>
            <h2 className="section-title mb-4" style={{ color: '#f5f5f5' }}>
              Five AI Agents.<br />
              <span className="gold-gradient">One Platform.</span>
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: '#666' }}>
              Not just recommendations — autonomous agents that understand, decide, and act on your behalf.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  to={feature.link}
                  className={`glass-card-hover rounded-2xl overflow-hidden flex flex-col ${idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  {feature.image && (
                    <div className="h-40 overflow-hidden" style={{ background: '#141414' }}>
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `rgba(245,166,35,0.12)`, border: `1px solid rgba(245,166,35,0.2)` }}
                    >
                      <Icon size={18} style={{ color: feature.color }} />
                    </div>
                    <h3 className="font-bold text-base" style={{ color: '#f5f5f5' }}>
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed flex-1" style={{ color: '#666' }}>
                      {feature.desc}
                    </p>
                    <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#f5a623' }}>
                      Explore <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="tag-chip mb-4 inline-block">Social Proof</span>
            <h2 className="section-title" style={{ color: '#f5f5f5' }}>
              Loved by Fashion-Forward India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="glass-card rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#f5a623" style={{ color: '#f5a623' }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(245,245,245,0.75)' }}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(245,166,35,0.15)', color: '#f5a623', border: '1px solid rgba(245,166,35,0.25)' }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#f5f5f5' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: '#666' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="rounded-3xl p-12"
            style={{
              background: 'linear-gradient(135deg, rgba(245,166,35,0.08) 0%, rgba(245,166,35,0.03) 100%)',
              border: '1px solid rgba(245,166,35,0.2)',
              boxShadow: '0 0 60px rgba(245,166,35,0.06)',
            }}
          >
            <Users size={40} className="mx-auto mb-6" style={{ color: '#f5a623' }} />
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#f5f5f5' }}>
              Ready to Meet Your AI Stylist?
            </h2>
            <p className="mb-8" style={{ color: '#666' }}>
              Join thousands of fashion-forward Indians who've upgraded their style game with AURAWEAR.
            </p>
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-sm tracking-wider gold-btn"
            >
              Build Your Style Profile
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
