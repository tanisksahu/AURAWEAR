import React, { useState, useMemo } from 'react';
import { Search, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import { useAllProducts, useSearchProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Footwear'];

export default function ShopPage() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: allProducts, isLoading: allLoading } = useAllProducts();
  const { data: searchResults, isLoading: searchLoading } = useSearchProducts(submittedQuery);

  const isLoading = submittedQuery ? searchLoading : allLoading;
  const rawProducts = submittedQuery ? (searchResults ?? []) : (allProducts ?? []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return rawProducts;
    return rawProducts.filter(p => p.category === activeCategory);
  }, [rawProducts, activeCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(query.trim());
    setActiveCategory('All');
  };

  const clearSearch = () => {
    setQuery('');
    setSubmittedQuery('');
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
        <span className="tag-chip mb-4 inline-block">AI-Powered Shop</span>
        <h1 className="section-title mb-3" style={{ color: '#f5f5f5' }}>
          Shop with <span className="gold-gradient">AI Intelligence</span>
        </h1>
        <p className="mb-8" style={{ color: '#666' }}>
          Don't filter. Just ask.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: '#666' }}
            />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder='Ask AI: "casual black oversized hoodie under ₹2000"'
              className="w-full pl-11 pr-4 py-4 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f5f5f5',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(245,166,35,0.4)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            />
            {submittedQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: '#666' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-4 rounded-xl font-bold text-sm tracking-wide gold-btn flex items-center gap-2"
          >
            <Sparkles size={16} />
            Ask AI
          </button>
        </form>

        {submittedQuery && (
          <p className="mt-3 text-sm" style={{ color: '#f5a623' }}>
            Showing results for: "{submittedQuery}"
          </p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-48 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal size={14} style={{ color: '#f5a623' }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#888' }}>
                Categories
              </span>
            </div>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    background: activeCategory === cat ? 'rgba(245,166,35,0.12)' : 'transparent',
                    color: activeCategory === cat ? '#f5a623' : '#888',
                    border: activeCategory === cat ? '1px solid rgba(245,166,35,0.25)' : '1px solid transparent',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Category Pills */}
        <div className="lg:hidden w-full">
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
                style={{
                  background: activeCategory === cat ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.05)',
                  color: activeCategory === cat ? '#f5a623' : '#888',
                  border: activeCategory === cat ? '1px solid rgba(245,166,35,0.3)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <main className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <Skeleton className="h-48 w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    <Skeleton className="h-4 w-1/2" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Search size={48} style={{ color: 'rgba(245,166,35,0.3)' }} />
              <h3 className="text-xl font-bold" style={{ color: '#f5f5f5' }}>No products found</h3>
              <p style={{ color: '#666' }}>
                {submittedQuery
                  ? `No results for "${submittedQuery}". Try a different query.`
                  : 'No products in this category yet.'}
              </p>
              {submittedQuery && (
                <button onClick={clearSearch} className="px-6 py-3 rounded-xl font-semibold text-sm gold-btn">
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm" style={{ color: '#666' }}>
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id.toString()} product={product} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
