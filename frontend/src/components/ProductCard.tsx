import React from 'react';
import { ShoppingCart, TrendingUp } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const CATEGORY_IMAGES: Record<string, string> = {
  'Tops': '/assets/generated/product-tshirt-white.dim_600x600.png',
  'Bottoms': '/assets/generated/product-cargo-brown.dim_600x600.png',
  'Outerwear': '/assets/generated/product-hoodie-black.dim_600x600.png',
  'Accessories': '/assets/generated/product-chain-gold.dim_600x600.png',
  'Footwear': '/assets/generated/product-sneakers-white.dim_600x600.png',
};

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addToCart } = useCart();

  const imageUrl = CATEGORY_IMAGES[product.category] || '/assets/generated/product-hoodie-black.dim_600x600.png';

  const handleAddToCart = () => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      imageUrl: product.imageUrl,
      price: Number(product.price),
      category: product.category,
    });
  };

  return (
    <div className="glass-card-hover rounded-2xl overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', background: '#141414' }}>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.isTrending && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
            style={{ background: 'rgba(245,166,35,0.9)', color: '#0a0a0a' }}
          >
            <TrendingUp size={10} />
            TRENDING
          </div>
        )}
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(10,10,10,0.8)', color: '#888', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-semibold text-sm leading-tight" style={{ color: '#f5f5f5' }}>
            {product.name}
          </h3>
          {!compact && (
            <p className="text-xs mt-1 line-clamp-2" style={{ color: '#666' }}>
              {product.description}
            </p>
          )}
        </div>

        {/* Tags */}
        {!compact && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
          </div>
        )}

        {/* Sizes */}
        {!compact && (
          <div className="flex flex-wrap gap-1">
            {product.sizes.slice(0, 5).map(size => (
              <span key={size} className="size-chip">{size}</span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-lg font-bold" style={{ color: '#f5a623' }}>
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold tracking-wide gold-btn"
          >
            <ShoppingCart size={12} />
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}
