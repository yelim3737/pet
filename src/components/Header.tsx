import React, { useState } from 'react';
import { PawPrint, ShoppingCart, Search, Edit3, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryKey } from '../types';

interface HeaderProps {
  cartCount: number;
  onNavigate: (view: 'home' | 'cart' | 'mypage' | 'all-reviews', productId?: string | null) => void;
  currentView: string;
  selectedCategory: CategoryKey;
  onSelectCategory: (category: CategoryKey) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({
  cartCount,
  onNavigate,
  currentView,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange
}: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  const categories: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: '전체보기' },
    { key: 'clothing', label: '의류/기어' },
    { key: 'toy', label: '장난감' },
    { key: 'treat', label: '간식/영양제' },
    { key: 'living', label: '리빙/식기' },
    { key: 'walk', label: '산책/외출' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fbfbf9]/95 backdrop-blur-md border-b border-[#f4f1ea]/80 shadow-xs" id="header-section">
      {/* Promo Bar */}
      <div className="w-full bg-[#7c7267] text-[#fbfbf9] text-center py-2 text-xs font-medium tracking-wide">
        <span className="inline-flex items-center gap-1.5 justify-center">
          반려아이를 위한 확실한 행복, 전 상품 무료체험 15일 보장 & 2시 입금 칼배송 🚚
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo */}
          <div className="flex items-center">
            <button
              onClick={() => {
                onSelectCategory('all');
                onNavigate('home', null);
              }}
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#1c1c1a] group cursor-pointer"
              id="brand-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-[#d06a4c] flex items-center justify-center text-white shadow-md shadow-[#d06a4c]/20 group-hover:scale-105 transition-transform duration-300">
                <PawPrint className="w-5.5 h-5.5 fill-current" />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="font-display text-lg tracking-wider font-extrabold text-[#1c1c1a]">소소한 펫</span>
                <span className="text-[10px] text-[#7c7267] font-mono mt-0.5 tracking-wider">SOSOHAN PETS</span>
              </div>
            </button>
          </div>

          {/* Center: Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  onSelectCategory(cat.key);
                  onNavigate('home', null);
                  // Scroll to product grid anchor if on homepage
                  setTimeout(() => {
                    document.getElementById('product-category-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  currentView === 'home' && selectedCategory === cat.key
                    ? 'text-[#d06a4c] bg-[#f4f1ea]'
                    : 'text-[#7c7267] hover:text-[#1c1c1a] hover:bg-[#f4f1ea]/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              {/* Expandable Search Input */}
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="absolute right-8 top-1/2 -translate-y-1/2 overflow-hidden flex items-center"
                  >
                    <input
                      type="text"
                      placeholder="행복을 검색해보세요"
                      value={searchQuery}
                      onChange={(e) => {
                        onSearchChange(e.target.value);
                        onNavigate('home', null);
                      }}
                      className="w-full bg-[#f4f1ea] border border-[#e2dfd9] text-xs font-medium rounded-full py-1.5 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-[#d06a4c] text-[#1c1c1a]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-[#7c7267] hover:text-[#1c1c1a] hover:bg-[#f4f1ea]/50 rounded-full transition-all duration-200 cursor-pointer"
                title="상품 검색"
                id="search-toggle-btn"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => onNavigate('all-reviews')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#7c7267] hover:text-[#1c1c1a] hover:bg-[#f4f1ea]/50 rounded-full transition-all duration-200 cursor-pointer"
              title="리뷰 아카이브"
              id="review-archive-btn"
            >
              <Edit3 className="w-4 h-4 text-[#d06a4c]" />
              <span>리뷰 타임라인</span>
            </button>

            {/* Shopping Cart button */}
            <button
              onClick={() => onNavigate('cart')}
              className={`p-2 rounded-full transition-all duration-300 relative cursor-pointer flex items-center justify-center ${
                currentView === 'cart'
                  ? 'bg-[#d06a4c] text-white shadow-md shadow-[#d06a4c]/20'
                  : 'text-[#7c7267] hover:text-[#1c1c1a] hover:bg-[#f4f1ea]/50'
              }`}
              title="장바구니"
              id="go-cart-btn"
            >
              <ShoppingCart className="w-5 h-5 font-bold" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  key={cartCount}
                  className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
