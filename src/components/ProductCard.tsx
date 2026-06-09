import React from 'react';
import { Star, Eye, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onViewProduct: (id: string) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
}

export default function ProductCard({ product, onViewProduct, onAddToCart }: ProductCardProps) {
  // Format prices with Korean Won locale
  const formatPrice = (value: number) => {
    return value.toLocaleString('ko-KR') + '원';
  };

  const discountRate = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <motion.div
      onClick={() => onViewProduct(product.id)}
      className="group bg-white rounded-2xl border border-[#f4f1ea] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#e2dfd9]/70 transition-all duration-300 flex flex-col h-full cursor-pointer"
      whileHover={{ y: -6 }}
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square overflow-hidden bg-[#fbfbf9] flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badge Overlay */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#7c7267] text-[#fbfbf9] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md shadow-xs">
            {product.badge}
          </span>
        )}

        {/* Image Quick Actions Panel */}
        <div className="absolute inset-0 bg-[#1c1c1a]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewProduct(product.id);
            }}
            className="w-10 h-10 rounded-full bg-white text-[#1c1c1a] flex items-center justify-center shadow-md hover:bg-[#d06a4c] hover:text-white transition-colors cursor-pointer"
            title="상세 보기"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => onAddToCart(product, e)}
            className="w-10 h-10 rounded-full bg-white text-[#1c1c1a] flex items-center justify-center shadow-md hover:bg-[#d06a4c] hover:text-white transition-colors cursor-pointer"
            title="장바구니 원터치 담기"
          >
            <ShoppingCart className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Product Info Description */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Category */}
          <span className="text-[11px] font-semibold text-[#7c7267]/70 font-mono tracking-wider uppercase">
            {product.categoryKo}
          </span>

          {/* Title */}
          <h3 className="font-sans font-bold text-sm tracking-tight text-[#1c1c1a] line-clamp-2 leading-snug group-hover:text-[#d06a4c] transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-[#7c7267] pt-0.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-xs text-[#1c1c1a]">{product.rating.toFixed(1)}</span>
            <span className="text-[#a8a196]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing Rows */}
        <div className="pt-4 mt-auto">
          <p className="text-xs text-[#a8a196] line-through">
            {formatPrice(product.originalPrice)}
          </p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-sm font-extrabold text-[#d06a4c] font-display">
              {discountRate}%
            </span>
            <span className="text-base font-extrabold text-[#1c1c1a] font-display">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
