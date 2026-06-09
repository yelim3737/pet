import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  Star,
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  Truck,
  CreditCard,
  MessageCircle,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Share2,
  Bookmark,
  Info,
  Calendar,
  User,
  ShieldCheck,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data and components
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INSTAGRAM_POSTS } from './data';
import { Product, Review, CartItem, Order, CategoryKey } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import SqueakerToyGame from './components/SqueakerToyGame';
import ReviewModal from './components/ReviewModal';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'product' | 'cart' | 'checkout' | 'confirmation' | 'all-reviews'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Shop Query and Filters State
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sosohan-cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('sosohan-reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Active Order (for confirmation page)
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    const saved = localStorage.getItem('sosohan-active-order');
    return saved ? JSON.parse(saved) : null;
  });

  // Write Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Accordion details index
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  // Detail View State
  const [detailSelectedColor, setDetailSelectedColor] = useState('');
  const [detailSelectedSize, setDetailSelectedSize] = useState('');
  const [detailSelectedType, setDetailSelectedType] = useState('');
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [detailActiveImgIndex, setDetailActiveImgIndex] = useState(0);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Review Filter/Sort States for timeline
  const [timelineRatingFilter, setTimelineRatingFilter] = useState<'all' | '5' | '4' | 'recent'>('all');
  const [timelineSearchQuery, setTimelineSearchQuery] = useState('');
  const [timelineSort, setTimelineSort] = useState<'latest' | 'helpful'>('latest');

  // Review search inside detail page
  const [detailReviewSearch, setDetailReviewSearch] = useState('');

  // Checkout inputs state
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutMemo, setCheckoutMemo] = useState('문 앞에 놓아주세요.');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'kakaopay' | 'naverpay'>('card');

  // Save Cart to local storage when changed
  useEffect(() => {
    localStorage.setItem('sosohan-cart', JSON.stringify(cart));
  }, [cart]);

  // Save Reviews to local storage when changed
  useEffect(() => {
    localStorage.setItem('sosohan-reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Toast auto-dismisser
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Dynamic Product Ratings based on actual reviews
  const products = useMemo(() => {
    return INITIAL_PRODUCTS.map((prod) => {
      const prodReviews = reviews.filter((r) => r.productId === prod.id);
      if (prodReviews.length === 0) return prod;

      const sum = prodReviews.reduce((acc, r) => acc + r.rating, 0);
      const avg = sum / prodReviews.length;

      return {
        ...prod,
        rating: avg,
        reviewCount: prodReviews.length
      };
    });
  }, [reviews]);

  // Active product details helper
  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return products.find((p) => p.id === selectedProductId) || null;
  }, [products, selectedProductId]);

  // Initialize selected product specifications when product page opens
  useEffect(() => {
    if (selectedProduct) {
      const colorOption = selectedProduct.options?.find((o) => o.type === 'color');
      const sizeOption = selectedProduct.options?.find((o) => o.type === 'size');
      const typeOption = selectedProduct.options?.find((o) => o.type === 'design');

      setDetailSelectedColor(colorOption ? colorOption.values[0] : '');
      setDetailSelectedSize(sizeOption ? sizeOption.values[0] : '');
      setDetailSelectedType(typeOption ? typeOption.values[0] : '');
      setDetailQuantity(1);
      setDetailActiveImgIndex(0);
      setOpenAccordion(0);
      setDetailReviewSearch('');
    }
  }, [selectedProduct]);

  // Filtered products list based on category and search query
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Navigation controller helper
  const navigateTo = (view: typeof currentView, productId: string | null = null) => {
    setCurrentView(view);
    if (productId) {
      setSelectedProductId(productId);
    }
    // Scroll to top on every route transition
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Add item helper
  const handleAddToCart = (product: Product, e: React.MouseEvent | null = null, explicitQty: number = 1) => {
    if (e) {
      e.stopPropagation();
    }

    const colorVal = e ? product.options?.find((o) => o.type === 'color')?.values[0] || '' : detailSelectedColor;
    const sizeVal = e ? product.options?.find((o) => o.type === 'size')?.values[0] || '' : detailSelectedSize;
    const typeVal = e ? product.options?.find((o) => o.type === 'design')?.values[0] || '' : detailSelectedType;

    const optKey = [colorVal, sizeVal, typeVal].filter(Boolean).join('-');
    const cartItemId = `${product.id}-${optKey}`;

    const existingIndex = cart.findIndex((item) => item.id === cartItemId);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += explicitQty;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        selectedColor: colorVal || undefined,
        selectedSize: sizeVal || undefined,
        selectedType: typeVal || undefined,
        quantity: explicitQty
      };
      setCart([...cart, newItem]);
    }

    setToastMessage(`🌿 ${product.name} 상품이 장바구니에 소담하게 담겼습니다!`);
  };

  // Immediate single checkout
  const handleDirectPurchase = (product: Product) => {
    const optKey = [detailSelectedColor, detailSelectedSize, detailSelectedType].filter(Boolean).join('-');
    const directItem: CartItem = {
      id: `direct-${product.id}-${optKey}`,
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      selectedColor: detailSelectedColor || undefined,
      selectedSize: detailSelectedSize || undefined,
      selectedType: detailSelectedType || undefined,
      quantity: detailQuantity
    };

    // Override cart for checkout or redirect
    setCart([directItem]);
    navigateTo('checkout');
  };

  // Modify cart quantities
  const updateCartQty = (id: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.id === id) {
          const nextQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, nextQty) };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    setCart(updated);
  };

  const removeCartItem = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
    setToastMessage('장바구니에서 상품이 안전하게 정리되었습니다.');
  };

  // Submit beautiful dynamic reviews
  const handleSubmitReview = (newReview: Review) => {
    setReviews([newReview, ...reviews]);
    setShowReviewModal(false);
    setToastMessage('📝 소중한 후기가 우주 끝까지 등록 완료되었습니다! 포인트 적립 완료!');
  };

  // Like review trigger
  const handleLikeReview = (reviewId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReviews(
      reviews.map((rev) => {
        if (rev.id === reviewId) {
          return { ...rev, likes: rev.likes + 1 };
        }
        return rev;
      })
    );
  };

  // Calculate pricing
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalOriginal = cart.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);
  const discountTotal = totalOriginal - subtotal;
  const shippingFee = subtotal >= 30000 || subtotal === 0 ? 0 : 3000;
  const estimatedTotal = subtotal + shippingFee;

  // Complete Order
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkoutName.trim() || !checkoutPhone.trim() || !checkoutAddress.trim()) {
      alert('배송 배달 정보를 꼼꼼하게 채워주세요!');
      return;
    }

    const orderNumber = `SH-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: orderNumber,
      date: new Date().toLocaleDateString('ko-KR'),
      items: [...cart],
      shippingAddress: {
        recipient: checkoutName,
        phone: checkoutPhone,
        address: checkoutAddress,
        request: checkoutMemo
      },
      paymentMethod,
      subtotal,
      shippingFee,
      discount: discountTotal,
      totalPayment: estimatedTotal,
      status: 'preparing'
    };

    setActiveOrder(newOrder);
    localStorage.setItem('sosohan-active-order', JSON.stringify(newOrder));
    
    // Clear cart post-purchase
    setCart([]);
    navigateTo('confirmation');
  };

  // Filtered timeline reviews
  const filteredTimelineReviews = useMemo(() => {
    return reviews
      .filter((rev) => {
        // Star ratings
        if (timelineRatingFilter === '5' && rev.rating !== 5) return false;
        if (timelineRatingFilter === '4' && rev.rating !== 4) return false;
        
        // Search text
        if (timelineSearchQuery.trim()) {
          const query = timelineSearchQuery.toLowerCase();
          const matchContent = rev.content.toLowerCase().includes(query);
          const matchAuthor = rev.author.toLowerCase().includes(query);
          const matchProduct = rev.productName?.toLowerCase().includes(query);
          return matchContent || matchAuthor || matchProduct;
        }
        return true;
      })
      .sort((a, b) => {
        if (timelineSort === 'helpful') {
          return b.likes - a.likes;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [reviews, timelineRatingFilter, timelineSearchQuery, timelineSort]);

  // Product page filtered reviews
  const filteredProductDetailReviews = useMemo(() => {
    if (!selectedProduct) return [];
    const prodReviews = reviews.filter((r) => r.productId === selectedProduct.id);

    if (detailReviewSearch.trim()) {
      const q = detailReviewSearch.toLowerCase();
      return prodReviews.filter(
        (r) => r.content.toLowerCase().includes(q) || r.author.toLowerCase().includes(q)
      );
    }
    return prodReviews;
  }, [reviews, selectedProduct, detailReviewSearch]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9]" id="app-container">
      {/* Dynamic Toast Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -45, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-100 bg-[#7c7267] text-[#fbfbf9] px-6 py-3 rounded-full text-xs font-bold tracking-wide shadow-2xl flex items-center gap-2 border border-white/10"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header Component */}
      <Header
        cartCount={cart.reduce((cnt, item) => cnt + item.quantity, 0)}
        onNavigate={(view, pId) => navigateTo(view, pId)}
        currentView={currentView}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Container Stage */}
      <main className="flex-1 flex flex-col mt-0">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-16"
            >
              {/* Elegant Hero Slider Layout */}
              <section className="relative w-full overflow-hidden bg-[#f4f1ea] py-16 px-4 md:py-24" id="home-hero-stage">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  
                  {/* Left Hero typography */}
                  <div className="space-y-6 text-left" id="hero-typography-box">
                    <span className="inline-flex items-center gap-1 bg-[#d06a4c]/10 text-[#d06a4c] text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                      <Sparkles className="w-3.5 h-3.5" /> Happy Moments with Sosohan Pets
                    </span>
                    <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#1c1c1a] tracking-tight leading-none">
                      우리 아이를 위한 <span className="text-[#d06a4c] block mt-2">소소하지만 확실한 행복</span>
                    </h1>
                    <p className="text-sm sm:text-base text-[#7c7267] max-w-lg leading-relaxed font-light">
                      흘러가는 반려생활의 찰나 속에서, 우리는 가장 자연스럽고 포근한 가치를 발견합니다. 엄선된 100% 안심 친환경 오가닉 소재, 신선한 자연 그대로 수비드 설계의 보물들을 확인해보세요.
                    </p>
                    
                    <div className="flex flex-wrap gap-3 pt-4">
                      <a
                        href="#product-category-section"
                        className="bg-[#d06a4c] text-[#fbfbf9] hover:bg-[#b05236] px-7 py-3.5 rounded-full text-xs font-bold tracking-wider shadow-md shadow-[#d06a4c]/20 transition-all cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById('product-category-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        지금 보물들 탐험하기 🐾
                      </a>
                      <button
                        onClick={() => navigateTo('all-reviews')}
                        className="bg-transparent border border-[#7c7267]/50 text-[#1c1c1a] hover:bg-[#7c7267]/10 px-6 py-3.5 rounded-full text-xs font-bold tracking-wider transition-all cursor-pointer"
                      >
                        고객 해피 테일 후기
                      </button>
                    </div>
                  </div>

                  {/* Right Hero beautiful illustration */}
                  <div className="relative flex justify-center" id="hero-image-frame">
                    <div className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                      <img
                        src="/src/assets/images/hero_white_puppy_1780996428332.png"
                        alt="Elegantly posing white puppy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1a]/40 to-transparent"></div>
                      
                      {/* Interactive Float badge */}
                      <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[#e2dfd9]/20 flex items-center justify-between shadow-lg">
                        <div className="text-left">
                          <p className="text-[10px] uppercase font-mono font-bold text-[#7c7267] tracking-widest">Today's Pick</p>
                          <h4 className="text-xs font-bold text-[#1c1c1a]">코지 루즈핏 니트 케이프 코트</h4>
                        </div>
                        <button
                          onClick={() => navigateTo('product', '6')}
                          className="bg-[#d06a4c] text-white p-2.5 rounded-xl hover:scale-105 transition-transform"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Fun retro sticker bubble */}
                    <div className="absolute -top-4 -left-4 bg-yellow-300 text-[#1c1c1a] font-display font-extrabold text-xs px-4 py-2.5 rounded-full shadow-lg transform -rotate-12 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#d06a4c] fill-current" />
                      <span>무료 체험 보장!</span>
                    </div>
                  </div>

                </div>
              </section>

              {/* Shopping Categorized Browse section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="product-category-section">
                
                {/* Section title */}
                <div className="text-center space-y-3">
                  <span className="font-mono text-[10px] font-bold text-[#d06a4c] uppercase tracking-widest">Bestsellers Carousel</span>
                  <h2 className="font-display font-bold text-3xl text-[#1c1c1a] tracking-tight flex items-center justify-center gap-2">
                    소소한 보물 상자 🌱 <span className="text-[#7c7267]">🐾</span>
                  </h2>
                  <p className="text-xs text-[#7c7267] max-w-md mx-auto">
                    언제나 안심하고 입힐 수 있는 건강하고 정교한 셀렉션들만을 모았습니다.
                  </p>
                </div>

                {/* Horizontal pill selection row */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" id="category-pills-row">
                  {(['all', 'clothing', 'toy', 'treat', 'living', 'walk'] as CategoryKey[]).map((cat) => {
                    const label =
                      cat === 'all'
                        ? '전체보기'
                        : cat === 'clothing'
                        ? '의류/기어 🧥'
                        : cat === 'toy'
                        ? '장난감/교구 🧸'
                        : cat === 'treat'
                        ? '간식/영양제 🐟'
                        : cat === 'living'
                        ? '리빙/식기 🪞'
                        : '산책/외출 🌤️';

                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-[#d06a4c] text-white shadow-md shadow-[#d06a4c]/20 border border-[#d06a4c]'
                            : 'bg-white text-[#7c7267] hover:text-[#1c1c1a] hover:bg-[#f4f1ea]/50 border border-[#e2dfd9]/60'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Grid list display */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-[#f4f1ea] rounded-2xl space-y-4">
                    <p className="text-sm font-semibold text-[#7c7267]">앗! 검색 조건에 맞는 소소한 펫 상품이 준비 중입니다.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 text-xs bg-[#f4f1ea] rounded-md font-semibold text-[#1c1c1a] hover:bg-[#e2dfd9]"
                    >
                      모든 카테고리 초기화
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onViewProduct={(id) => navigateTo('product', id)}
                        onAddToCart={(product, e) => handleAddToCart(product, e)}
                      />
                    ))}

                    {/* Fixed 'View More Card' as requested by the original specification details */}
                    <div
                      onClick={() => setSelectedCategory('all')}
                      className="group bg-[#f4f1ea]/30 rounded-2xl border-2 border-dashed border-[#e2dfd9] flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-[#f4f1ea]/60 transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-full bg-white text-[#7c7267] group-hover:text-[#d06a4c] flex items-center justify-center shadow-xs mb-3 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6" />
                      </div>
                      <h4 className="font-sans font-bold text-[#1c1c1a] text-sm group-hover:text-[#d06a4c]">더 많은 보물들 보러가기 🦴</h4>
                      <p className="text-[11px] text-[#7c7267] mt-1">소소한 펫이 주기적으로 발굴해오는 숨겨진 프리미엄 보물 전체보기</p>
                    </div>
                  </div>
                )}
              </section>

              {/* Brand Values Block */}
              <section className="bg-[#7c7267] text-[#fbfbf9] rounded-[3rem] max-w-7xl mx-auto px-6 py-16 md:py-20 mx-4" id="brand-metrics-panel">
                <div className="max-w-4xl mx-auto text-center space-y-16">
                  {/* Copy */}
                  <div className="space-y-4">
                    <span className="font-mono text-xs font-bold tracking-widest text-[#fbfbf9]/60 uppercase">Our Core Mission</span>
                    <h2 className="font-display font-black text-3xl sm:text-4xl">
                      작지만 확실한 행복, 소소한 펫 🌱
                    </h2>
                    <p className="text-xs sm:text-sm text-[#fbfbf9]/80 max-w-xl mx-auto leading-relaxed font-light">
                      우리는 무분별하게 생산되는 유해 화학 플라스틱 제품이나 출처 불분명한 식품 포장들과 타협하지 않습니다. 우리 곁을 지키며 대가 없는 사랑을 일깨워주는 평생 반려 아가들의 가장 보드랍고 행복한 순간을 연구합니다.
                    </p>
                  </div>

                  {/* Counters / Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-4 border-t border-white/15">
                    <div className="space-y-2">
                      <p className="font-display text-4xl font-extrabold text-amber-300">1,200+ Happy Pups</p>
                      <h4 className="text-xs font-bold">소소한 펫과 함께 행복을 찾은 아이들</h4>
                      <p className="text-[10px] text-[#fbfbf9]/60">소중하게 보내주신 실제 수기 편지와 해피 테일 리뷰 합산</p>
                    </div>

                    <div className="space-y-2">
                      <p className="font-display text-4xl font-extrabold text-amber-300">100% Organic Cotton</p>
                      <h4 className="text-xs font-bold">아이들의 연약한 무방비 피부를 지키는 천연 소재</h4>
                      <p className="text-[10px] text-[#fbfbf9]/60">국제 유기농 무농약 엄격 인증 통과 원사 가공 비율 보장</p>
                    </div>

                    <div className="space-y-2">
                      <p className="font-display text-4xl font-extrabold text-amber-300">Fast K-Delivery</p>
                      <h4 className="text-xs font-bold">오후 2시 전 주문 완료 시, 전국 번개 입고</h4>
                      <p className="text-[10px] text-[#fbfbf9]/60">배송 중 쓸림 사고나 파손 예방을 위한 초진공 삼중 안심 포장</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bento Social proof and Writing reviews */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="social-instagram-timeline">
                
                {/* Heading line */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] font-bold text-[#d06a4c] tracking-widest uppercase">Social Feed Logs</span>
                    <h2 className="font-sans font-extrabold text-2xl text-[#1c1c1a]">#SosohanPets Daily Logs 📸</h2>
                    <p className="text-xs text-[#7c7267]">자연과 일상 속에서 가장 아이답게 웃고 뛰어다니는 해피 라이프 일지</p>
                  </div>

                  {/* Review modal trigger */}
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="inline-flex items-center gap-1.5 bg-white border border-[#e2dfd9] text-[#1c1c1a] hover:border-[#1c1c1a] px-5 py-2.5 rounded-full text-xs font-extrabold shadow-xs transition-all cursor-pointer"
                  >
                    <span>자랑스러운 후기 직접 자랑하기 ✍️</span>
                  </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {INSTAGRAM_POSTS.map((post) => (
                    <div
                      key={post.id}
                      className="group bg-white rounded-2xl overflow-hidden border border-[#f4f1ea] shadow-xs relative aspect-square"
                    >
                      <img
                        src={post.image}
                        alt="Instagram style post"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Black layout hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                        <span className="font-mono text-[10px] font-bold text-amber-300">{post.tag}</span>
                        <p className="text-[10px] sm:text-xs font-medium leading-relaxed mt-1 line-clamp-3">
                          {post.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Big banner Review Write */}
                <div className="bg-[#f4f1ea]/60 rounded-3xl p-8 sm:p-10 border border-[#e2dfd9]/80 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-3 max-w-xl text-left">
                    <h3 className="font-display font-bold text-xl text-[#1c1c1a]">아이들의 행복 투표, 당신의 소중한 의견을 들려주세요 🗣️</h3>
                    <p className="text-xs text-[#7c7267] leading-relaxed">
                      모든 정성스러운 한 줄의 후기는 아직 완벽한 단잠에 들지 못했거나 쓸림 없는 산책길을 찾지 못해 헤매고 있는 전국의 반려가구 보호자분들께 큰 횃불과 같은 지침서가 됩니다. 포인트를 선물합니다!
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="shrink-0 bg-[#7c7267] text-white hover:bg-[#1c1c1a] px-8 py-4 rounded-full text-xs font-bold tracking-wider transition-colors shadow-lg cursor-pointer"
                  >
                    소소한 후기 남기고 1,000P 받기 🏷️
                  </button>
                </div>
              </section>
            </motion.div>
          )}

          {/* Product detail view */}
          {currentView === 'product' && selectedProduct && (
            <motion.div
              key="product-detail-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16"
            >
              {/* Breadcrumb line & back navigation */}
              <div className="flex items-center justify-between border-b border-[#f4f1ea] pb-5">
                <button
                  onClick={() => navigateTo('home')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7c7267] hover:text-[#1c1c1a] group cursor-pointer"
                  id="product-back-btn"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span>돌아가기</span>
                </button>

                <div className="text-xs text-[#7c7267] font-mono flex items-center gap-1">
                  <span>Home</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>{selectedProduct.categoryKo}</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-[#1c1c1a] font-semibold">{selectedProduct.name}</span>
                </div>
              </div>

              {/* Product main stage columns layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start" id="product-detail-body">
                
                {/* Left columns: Images stage */}
                <div className="space-y-4">
                  <div className="aspect-square bg-white border border-[#f4f1ea] rounded-3xl overflow-hidden shadow-xs">
                    <img
                      src={selectedProduct.additionalImages[detailActiveImgIndex] || selectedProduct.image}
                      alt={selectedProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-all"
                    />
                  </div>

                  {/* Thumbnail slider */}
                  {selectedProduct.additionalImages && selectedProduct.additionalImages.length > 1 && (
                    <div className="flex gap-2">
                      {selectedProduct.additionalImages.map((imgUrl, i) => (
                        <button
                          key={i}
                          onClick={() => setDetailActiveImgIndex(i)}
                          className={`w-18 h-18 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                            detailActiveImgIndex === i ? 'border-[#d06a4c]' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt="Product Thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Benefits Cards below image */}
                  <div className="grid grid-cols-3 gap-2 py-4 border-t border-[#f4f1ea] text-center bg-white rounded-2xl p-4">
                    <div className="space-y-1 border-r border-[#f4f1ea]">
                      <span className="inline-flex items-center justify-center text-[#d06a4c]">🛡️</span>
                      <p className="text-[10px] font-bold text-[#1c1c1a]">100% 무자극 소재</p>
                      <p className="text-[9px] text-[#7c7267]">피모 트러블 전면 안심</p>
                    </div>
                    <div className="space-y-1 border-r border-[#f4f1ea]">
                      <span className="inline-flex items-center justify-center text-[#d06a4c]">🚚</span>
                      <p className="text-[10px] font-bold text-[#1c1c1a]">오후 2시 칼출발</p>
                      <p className="text-[9px] text-[#7c7267]">내일 바로 도착 보장</p>
                    </div>
                    <div className="space-y-1">
                      <span className="inline-flex items-center justify-center text-[#d06a4c]">🌾</span>
                      <p className="text-[10px] font-bold text-[#1c1c1a]">15일 환불 무료체험</p>
                      <p className="text-[9px] text-[#7c7267]">사용해도 백퍼 무료환불</p>
                    </div>
                  </div>
                </div>

                {/* Right Columns: product metadata specifications selection */}
                <div className="space-y-8 text-left" id="options-panel-box">
                  <div className="space-y-3">
                    {selectedProduct.badge && (
                      <span className="inline-block bg-[#7c7267] text-[#fbfbf9] text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
                        {selectedProduct.badge}
                      </span>
                    )}
                    <h1 className="font-display font-black text-2xl sm:text-3xl text-[#1c1c1a] tracking-tight leading-tight">
                      {selectedProduct.name}
                    </h1>
                    <p className="font-mono text-xs uppercase tracking-wider text-[#a8a196]">
                      {selectedProduct.englishName}
                    </p>

                    {/* rating line */}
                    <div className="flex items-center gap-2 pt-1 border-b border-[#f4f1ea] pb-4">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs font-extrabold text-[#1c1c1a] ml-1">{selectedProduct.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-[#7c7267]">
                        | 해피테일 리뷰 <span className="font-bold underline text-[#d06a4c] cursor-pointer" onClick={() => {
                          document.getElementById('reviews-anchor-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}>{selectedProduct.reviewCount}개</span>
                      </span>
                    </div>
                  </div>

                  {/* Pricing details card */}
                  <div className="bg-[#f4f1ea]/40 rounded-2xl p-4 sm:p-5 flex items-baseline justify-between">
                    <div>
                      <p className="text-xs text-[#a8a196] line-through">정상 판매가: {selectedProduct.originalPrice.toLocaleString()}원</p>
                      <p className="text-xl font-black text-[#1c1c1a] mt-0.5">
                        특별 체험가:{' '}
                        <span className="text-2xl font-black text-[#d06a4c] font-display">
                          {selectedProduct.price.toLocaleString()}원
                        </span>
                      </p>
                    </div>
                    <span className="bg-[#d06a4c]/10 text-[#d06a4c] font-extrabold text-xs px-3 py-1 rounded-md">
                      특별 {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% 할인가 적용중
                    </span>
                  </div>

                  {/* Options selections */}
                  <div className="space-y-5 py-4 border-t border-b border-[#f4f1ea]">
                    {selectedProduct.options?.map((option) => (
                      <div key={option.name} className="space-y-2">
                        <label className="text-xs font-bold text-[#7c7267] tracking-wider uppercase">
                          {option.name}
                        </label>

                        {/* Standard responsive radio chips */}
                        <div className="flex flex-wrap gap-2">
                          {option.values.map((v, idx) => {
                            let isSelected = false;
                            if (option.type === 'color') isSelected = detailSelectedColor === v;
                            if (option.type === 'size') isSelected = detailSelectedSize === v;
                            if (option.type === 'design') isSelected = detailSelectedType === v;

                            return (
                              <button
                                key={v}
                                onClick={() => {
                                  if (option.type === 'color') setDetailSelectedColor(v);
                                  if (option.type === 'size') setDetailSelectedSize(v);
                                  if (option.type === 'design') setDetailSelectedType(v);
                                }}
                                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer text-left flex flex-col justify-between ${
                                  isSelected
                                    ? 'border-[#d06a4c] bg-[#d06a4c]/5 text-[#d06a4c] shadow-xs ring-1 ring-[#d06a4c]'
                                    : 'border-[#e2dfd9] hover:border-[#1c1c1a] bg-white text-[#1c1c1a]'
                                }`}
                              >
                                <span>{v}</span>
                                {option.descriptions && option.descriptions[idx] && (
                                  <span className={`text-[9px] mt-0.5 tracking-tight font-normal ${isSelected ? 'text-[#d06a4c]/70' : 'text-[#7c7267]'}`}>
                                    {option.descriptions[idx]}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Quantity Selector Option */}
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-bold text-[#7c7267] tracking-wider">구매 수량 선택</label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#f4f1ea] border border-[#e2dfd9] rounded-xl overflow-hidden h-11">
                          <button
                            type="button"
                            onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                            className="w-10 h-full hover:bg-[#e2dfd9] text-[#7c7267] flex items-center justify-center transition-colors font-bold cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center text-xs font-bold text-[#1c1c1a] font-mono">
                            {detailQuantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setDetailQuantity(detailQuantity + 1)}
                            className="w-10 h-full hover:bg-[#e2dfd9] text-[#7c7267] flex items-center justify-center transition-colors font-bold cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-[11px] text-[#7c7267]">단 한 품목도 포장에 정성을 가득 담아 발송됩니다!</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary of Selected Items row */}
                  <div className="space-y-1 text-xs">
                    <p className="font-semibold text-[#7c7267]">선택 사항 요약 :</p>
                    <p className="bg-[#fbfbf9] p-3.5 border border-[#f4f1ea] text-[#1c1c1a] rounded-xl font-medium leading-relaxed">
                      🎁 {selectedProduct.name}
                      {detailSelectedColor && ` - [색상: ${detailSelectedColor}]`}
                      {detailSelectedSize && ` - [사이즈: ${detailSelectedSize}]`}
                      {detailSelectedType && ` - [디자인: ${detailSelectedType}]`} (수량 {detailQuantity}개)
                      <span className="block font-bold text-[#d06a4c] font-display mt-1.5 pt-1.5 border-t border-[#f4f1ea]/80 text-sm">
                        합계 금액: {(selectedProduct.price * detailQuantity).toLocaleString()}원
                      </span>
                    </p>
                  </div>

                  {/* Purchase buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleAddToCart(selectedProduct, null, detailQuantity)}
                      className="bg-white border-2 border-[#7c7267] hover:border-[#1c1c1a] text-[#1c1c1a] py-4 rounded-xl text-xs font-extrabold tracking-wider leading-none shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-4.5 h-4.5" />
                      <span>장바구니 담기</span>
                    </button>
                    <button
                      onClick={() => handleDirectPurchase(selectedProduct)}
                      className="bg-[#d06a4c] text-white hover:bg-[#b05236] py-4 rounded-xl text-xs font-extrabold tracking-wider leading-none shadow-md shadow-[#d06a4c]/20 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>바로 구매하기 ⚡</span>
                    </button>
                  </div>

                  {/* SPECIAL GAME/WIDGET PORT FOR SQUEAKER TOY IF ID IS 2 */}
                  {selectedProduct.id === '2' && (
                    <div className="pt-2">
                      <SqueakerToyGame />
                    </div>
                  )}

                  {/* Accordion list details */}
                  <div className="space-y-1.5 border-t border-[#f4f1ea] pt-6" id="product-accordions-row">
                    {[
                      {
                        title: '🌿 깐깐한 소재 정보 및 세탁 방법',
                        content: selectedProduct.highlights
                      },
                      {
                        title: '📐 안심 사이즈 실측 표준 가이드',
                        content: [
                          'S Size: 흉곽 둘레 30-36cm 내외 (추천 몸무게 1.5kg - 3.2kg 미만 포메라니안, 치와와, 소형 말티즈)',
                          'M Size: 흉곽 둘레 35-42cm 내외 (추천 몸무게 3.2kg - 6kg 미만 푸들, 시츄, 중형 비숑)',
                          'L Size: 흉곽 둘레 40-52cm 내외 (추천 몸무게 6kg - 10.5kg 중소형견 코기, 일지시바, 테리어)'
                        ]
                      },
                      {
                        title: '📦 배송 보증 및 15일 무체험 환불제',
                        content: [
                          '전 상품 무료배송 지원 기준 수량 충족 시 무제한 프리패스',
                          '변심 혹은 반려아이가 제품을 마음에 들어 하지 않는 경우, 사용하신 이력이 있더라도 수령일로부터 15일 이내라면 무료 반품 및 교환을 투명하고 빠르게 접수해 드립니다.'
                        ]
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="border-b border-[#f4f1ea]">
                        <button
                          type="button"
                          onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                          className="w-full flex items-center justify-between py-4 text-xs font-bold text-[#1c1c1a] border-none bg-transparent hover:text-[#d06a4c] transition-colors cursor-pointer text-left"
                        >
                          <span>{item.title}</span>
                          {openAccordion === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        
                        <AnimatePresence>
                          {openAccordion === idx && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pb-4 pl-1 text-[11px] sm:text-xs text-[#7c7267] space-y-2 leading-relaxed">
                                {item.content.map((bullet, bidx) => (
                                  <p key={bidx} className="flex items-start gap-1">
                                    <span className="text-[#d06a4c] shrink-0">•</span>
                                    <span>{bullet}</span>
                                  </p>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Product specific reviews */}
              <section className="border-t border-[#f4f1ea] pt-12 space-y-6 text-left" id="reviews-anchor-section">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#f4f1ea] pb-5">
                  <div className="space-y-1">
                    <h3 className="font-sans font-extrabold text-xl text-[#1c1c1a]">
                      해피 테일 리뷰 🐕 ({filteredProductDetailReviews.length})
                    </h3>
                    <p className="text-xs text-[#7c7267]">소중한 우리 아이들의 소소 행복 구매 후기</p>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="후기 본문 내용 검색"
                      value={detailReviewSearch}
                      onChange={(e) => setDetailReviewSearch(e.target.value)}
                      className="bg-[#f4f1ea] text-xs font-medium rounded-full py-1.5 pl-4 pr-10 border border-[#e2dfd9] focus:outline-none focus:ring-1 focus:ring-[#d06a4c] text-[#1c1c1a]"
                    />
                  </div>
                </div>

                {filteredProductDetailReviews.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-[#f4f1ea]">
                    <p className="text-xs text-[#7c7267]">첫 번째 아름다운 리뷰의 보호자가 되어주세요! 🌱</p>
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="mt-3 bg-[#f4f1ea] text-[#1c1c1a] hover:bg-[#e2dfd9] px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      첫 리뷰 남기고 선물받기
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProductDetailReviews.map((rev) => (
                      <div key={rev.id} className="bg-white rounded-2xl border border-[#f4f1ea] p-5 sm:p-6 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1 text-[#7c7267] text-xs">
                              <span className="font-bold text-[#1c1c1a]">{rev.author}</span>
                              <span className="text-[#a8a196] font-mono">({rev.date})</span>
                            </div>
                            
                            {/* Stars */}
                            <div className="flex items-center text-amber-400">
                              {Array.from({ length: 5 }).map((_, si) => (
                                <Star key={si} className={`w-3.5 h-3.5 ${si < rev.rating ? 'fill-current' : 'text-gray-200'}`} />
                              ))}
                            </div>
                          </div>

                          {/* Options details tag info */}
                          {rev.options && (
                            <span className="bg-[#f4f1ea] text-[#7c7267] text-[10px] px-2.5 py-1 rounded-md font-medium">
                              구매선택: {rev.options}
                            </span>
                          )}
                        </div>

                        {/* Review text and image */}
                        <div className="flex flex-col sm:flex-row gap-5 items-start">
                          {rev.image && (
                            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-[#f4f1ea]">
                              <img src={rev.image} alt="User review asset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          )}
                          <p className="text-xs sm:text-sm text-[#1c1c1a] leading-relaxed flex-1">
                            {rev.content}
                          </p>
                        </div>

                        {/* Helpful like button */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#f4f1ea]/65 text-xs text-[#7c7267]">
                          <span className="text-[10px] font-mono text-[#a8a196]">소소한 펫 안심 구매 인증 리뷰 완료</span>
                          
                          <button
                            onClick={(e) => handleLikeReview(rev.id, e)}
                            className="inline-flex items-center gap-1 text-[#7c7267] hover:text-[#d06a4c] font-semibold bg-[#f4f1ea] px-3 py-1.5 rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-[#d06a4c]" />
                            <span>도움이 되었어요 ({rev.likes})</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Recommended Items */}
              <section className="border-t border-[#f4f1ea] pt-12 space-y-6 text-left" id="recommendation-row">
                <div className="space-y-1 text-center">
                  <span className="font-mono text-[9px] font-bold text-[#d06a4c] tracking-widest uppercase">Cross Sell Recommendations</span>
                  <h3 className="font-sans font-extrabold text-xl text-[#1c1c1a]">함께하면 두 배 더 좋은 아이템들 🌟</h3>
                  <p className="text-xs text-[#7c7267]">우리아이 행복 지수를 치솟게 만들 엄선 추천 조합</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {products
                    .filter((p) => p.id !== selectedProductId)
                    .slice(0, 3)
                    .map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onViewProduct={(id) => navigateTo('product', id)}
                        onAddToCart={(product, e) => handleAddToCart(product, e)}
                      />
                    ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* Shopping Cart page view layout */}
          {currentView === 'cart' && (
            <motion.div
              key="cart-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
            >
              {/* Heading and back */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#f4f1ea] pb-5">
                <div className="space-y-1 text-left">
                  <h1 className="font-display font-black text-2xl text-[#1c1c1a]">내 보물가방 장바구니 🎒</h1>
                  <p className="text-xs text-[#7c7267]">아이들이 기다리는 행복 상자 포장 대기 목록</p>
                </div>
                <button
                  onClick={() => navigateTo('home')}
                  className="text-xs font-semibold text-[#d06a4c] hover:underline cursor-pointer"
                >
                  보물사냥터 홈으로 계속 쇼핑하기
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-20 text-center bg-white border border-[#f4f1ea] rounded-3xl space-y-6">
                  <div className="w-16 h-16 rounded-full bg-[#f4f1ea] text-[#7c7267] flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-sans font-bold text-sm text-[#1c1c1a]">장바구니가 텅 비어있습니다.</h3>
                  <p className="text-xs text-[#7c7267] max-w-xs mx-auto">
                    아이들에게 기쁨을 선물할 정성스런 오가닉 하네스와 바스락 장난감을 구경하러 떠나보세요!
                  </p>
                  <button
                    onClick={() => navigateTo('home')}
                    className="bg-[#d06a4c] text-white px-6 py-3 rounded-full text-xs font-bold transition-transform hover:scale-105"
                  >
                    지금 보물들 뒤지러가기
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" id="cart-item-body">
                  {/* Left Column: Items */}
                  <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl border border-[#f4f1ea] p-4 sm:p-5 flex gap-4 sm:gap-5 items-center justify-between" id={`cart-item-${item.id}`}>
                        <div className="flex gap-4 items-center flex-1 text-left">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-[#f4f1ea]"
                          />
                          <div className="space-y-1.5 flex-1">
                            <h3 className="font-sans font-bold text-xs sm:text-sm text-[#1c1c1a] line-clamp-1">{item.name}</h3>
                            <div className="flex flex-wrap gap-1">
                              {item.selectedColor && (
                                <span className="bg-[#f4f1ea] text-[#7c7267] text-[9px] font-bold px-2 py-0.5 rounded-sm">
                                  Color: {item.selectedColor}
                                </span>
                              )}
                              {item.selectedSize && (
                                <span className="bg-[#f4f1ea] text-[#7c7267] text-[9px] font-bold px-2 py-0.5 rounded-sm">
                                  Size: {item.selectedSize}
                                </span>
                              )}
                              {item.selectedType && (
                                <span className="bg-[#f4f1ea] text-[#7c7267] text-[9px] font-bold px-2 py-0.5 rounded-sm">
                                  Design: {item.selectedType}
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-bold font-mono text-[#d06a4c]">{(item.price * item.quantity).toLocaleString()}원</p>
                          </div>
                        </div>

                        {/* Quantity Counter & Trash Column */}
                        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                          <div className="flex items-center bg-[#f4f1ea] rounded-lg h-9 border border-[#e2dfd9]/40 overflow-hidden">
                            <button
                              onClick={() => updateCartQty(item.id, -1)}
                              className="w-8 h-full hover:bg-[#e2dfd9] text-[#7c7267] flex items-center justify-center transition-colors font-bold cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold font-mono text-[#1c1c1a]">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQty(item.id, 1)}
                              className="w-8 h-full hover:bg-[#e2dfd9] text-[#7c7267] flex items-center justify-center transition-colors font-bold cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeCartItem(item.id)}
                            className="p-2 text-[#a8a196] hover:text-[#d06a4c] rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Bulk Clean action */}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          setCart([]);
                          setToastMessage('장바구니가 맑게 비워졌습니다.');
                        }}
                        className="text-xs font-semibold text-[#7c7267] hover:text-rose-500 hover:underline cursor-pointer"
                        id="clear-all-cart-btn"
                      >
                        주문 포장대 전부 비우기
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Pricing breakdown & Order Summary Column */}
                  <div className="space-y-6 text-left bg-white p-6 rounded-3xl border border-[#f4f1ea]">
                    <h3 className="font-sans font-extrabold text-sm text-[#1c1c1a] border-b border-[#f4f1ea] pb-3">최종 구매 예정서</h3>
                    
                    <div className="space-y-3.5 text-xs text-[#7c7267]">
                      <div className="flex justify-between items-center">
                        <span>선택 상품 가액 총액 :</span>
                        <span className="font-bold text-[#1c1c1a] font-mono">{totalOriginal.toLocaleString()}원</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>소소 할인 우대액 :</span>
                        <span className="font-bold text-emerald-600 font-mono">-{discountTotal.toLocaleString()}원</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>배송비 배달비 :</span>
                        <span className="font-bold text-[#1c1c1a] font-mono">
                          {shippingFee === 0 ? '무료배송 ✨' : `${shippingFee.toLocaleString()}원`}
                        </span>
                      </div>

                      {shippingFee > 0 && (
                        <p className="bg-[#f4f1ea] text-[#7c7267] text-[10px] p-2 rounded-lg leading-relaxed font-semibold">
                          💡 30,000원 이상 주문 충족 시 무료배송 혜택을 챙기실 수 있습니다! {(30000 - subtotal).toLocaleString()}원 더 담아보세요.
                        </p>
                      )}

                      <div className="flex justify-between items-center pt-3 border-t border-[#f4f1ea] text-sm text-[#1c1c1a]">
                        <span className="font-bold">최종 결제 금액 :</span>
                        <span className="font-black text-lg text-[#d06a4c] font-display font-mono">{estimatedTotal.toLocaleString()}원</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigateTo('checkout')}
                      className="w-full bg-[#d06a4c] text-white py-4 rounded-xl font-bold text-xs tracking-wider shadow-md shadow-[#d06a4c]/30 hover:bg-[#b05236] transition-colors cursor-pointer block text-center"
                      id="proc-checkout-btn"
                    >
                      결제 단계로 이동하기 🚚
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Checkout billing page view layout */}
          {currentView === 'checkout' && (
            <motion.div
              key="checkout-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
            >
              {/* Heading line */}
              <div className="border-b border-[#f4f1ea] pb-5 text-left">
                <h1 className="font-display font-black text-2xl text-[#1c1c1a]">우리아이 행복 주문/결제 📝</h1>
                <p className="text-xs text-[#7c7267]">입력하신 정성스런 주소로 안전하고 두껍게 발송됩니다.</p>
              </div>

              <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-left" id="checkout-item-body">
                {/* Left side Columns: Information input forms */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Delivery Info */}
                  <div className="bg-white p-6 rounded-2xl border border-[#f4f1ea] space-y-4">
                    <h3 className="font-sans font-bold text-[#1c1c1a] text-sm border-b border-[#f4f1ea] pb-3">📦 안전 배송 수령 정보</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#7c7267]">보호자 수령인 성명</label>
                        <input
                          type="text"
                          placeholder="실제 이름을 적어주세요"
                          required
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value)}
                          className="w-full bg-[#f4f1ea] border border-[#e2dfd9] rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#d06a4c] text-[#1c1c1a]"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#7c7267]">긴급 안심 연락처</label>
                        <input
                          type="tel"
                          placeholder="010-0000-0000"
                          required
                          value={checkoutPhone}
                          onChange={(e) => setCheckoutPhone(e.target.value)}
                          className="w-full bg-[#f4f1ea] border border-[#e2dfd9] rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#d06a4c] text-[#1c1c1a]"
                        />
                      </div>
                    </div>

                    {/* Address with responsive search visual mock */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#7c7267]">배송지 주소</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="배송 목적지 전체 주소 입력"
                          required
                          value={checkoutAddress}
                          onChange={(e) => setCheckoutAddress(e.target.value)}
                          className="flex-1 bg-[#f4f1ea] border border-[#e2dfd9] rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#d06a4c] text-[#1c1c1a]"
                          id="checkout-address-input"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCheckoutAddress('서울특별시 성동구 성수일로 4길 12 한라 아파트 101동 602호');
                            setToastMessage('안심 성수동 대표 주소가 모의 자동 완성되었습니다.');
                          }}
                          className="shrink-0 bg-[#7c7267] text-white hover:bg-[#1c1c1a] px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          주소자동완성
                        </button>
                      </div>
                    </div>

                    {/* Delivery memo */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#7c7267]">포장 배송 기사님 안심 메모</label>
                      <select
                        value={checkoutMemo}
                        onChange={(e) => setCheckoutMemo(e.target.value)}
                        className="w-full bg-[#f4f1ea] border border-[#e2dfd9] rounded-xl px-4 py-3 text-xs font-normal text-[#1c1c1a] focus:outline-none"
                      >
                        <option value="문 앞에 놓아주세요.">문 앞에 소담스럽게 놓아주세요.</option>
                        <option value="벨을 누르지 말고 문자 남겨주세요. 아가 자는 중 🤫">인터폰 벨 말고 휴대폰 문자 요망 (반려아이 수면 중 🤫)</option>
                        <option value="경비실에 안전하게 보관 위탁 바랍니다.">경비실에 깔끔히 위탁 보관해 주세요.</option>
                        <option value="직접 연락 후 전달 바라요.">직접 전화를 먼저 걸어주세요.</option>
                      </select>
                    </div>
                  </div>

                  {/* Payment selector */}
                  <div className="bg-white p-6 rounded-2xl border border-[#f4f1ea] space-y-4">
                    <h3 className="font-sans font-bold text-[#1c1c1a] text-sm border-b border-[#f4f1ea] pb-3">💳 실시간 안심 결제수단</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Credit card */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                          paymentMethod === 'card'
                            ? 'border-[#d06a4c] bg-[#d06a4c]/5 text-[#d06a4c]'
                            : 'border-[#e2dfd9] bg-white text-[#7c7267] hover:border-[#1c1c1a]'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span className="text-xs font-bold">일반 안심 신용카드</span>
                      </button>

                      {/* Kakao pay */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('kakaopay')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                          paymentMethod === 'kakaopay'
                            ? 'border-yellow-400 bg-yellow-50 text-amber-800'
                            : 'border-[#e2dfd9] bg-white text-[#7c7267] hover:border-[#1c1c1a]'
                        }`}
                      >
                        <span className="text-yellow-500 font-extrabold text-xs">kakaopay</span>
                        <span className="text-xs font-bold">카카오페이 빠른결제</span>
                      </button>

                      {/* Naver pay */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('naverpay')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                          paymentMethod === 'naverpay'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                            : 'border-[#e2dfd9] bg-white text-[#7c7267] hover:border-[#1c1c1a]'
                        }`}
                      >
                        <span className="text-emerald-600 font-extrabold text-xs">N Pay</span>
                        <span className="text-xs font-bold">네이버페이 포인트결제</span>
                      </button>
                    </div>

                    <div className="bg-[#f4f1ea] p-3 rounded-lg text-[10px] text-[#7c7267] leading-relaxed">
                      💡 소소한 펫은 이중 신뢰 암호화 보안 게이트웨이를 완전히 거치며, 모의 결제 완료 후 실제 돈은 단 1원도 청구되지 않는 가상 시뮬레이션으로 안전하게 동작합니다.
                    </div>
                  </div>
                </div>

                {/* Right columns Order Items Breakdown total list */}
                <div className="bg-white p-6 rounded-2xl border border-[#f4f1ea] space-y-6">
                  <h3 className="font-sans font-bold text-sm text-[#1c1c1a] border-b border-[#f4f1ea] pb-3 font-display uppercase tracking-wider">주문 보물 내역</h3>
                  
                  {/* Miniature list */}
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center text-xs">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-md border" referrerPolicy="no-referrer" />
                        <div className="flex-1 text-left">
                          <p className="font-bold text-[#1c1c1a] line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-[#7c7267]">
                            {item.selectedColor && `[${item.selectedColor}] `}
                            {item.selectedSize && `[${item.selectedSize}] `}
                            수량 {item.quantity}개
                          </p>
                        </div>
                        <span className="font-bold font-mono text-[#7c7267]">{(item.price * item.quantity).toLocaleString()}원</span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2.5 text-xs text-[#7c7267] border-t border-[#f4f1ea] pt-4">
                    <div className="flex justify-between items-center">
                      <span>선택 상품 가액 총합 :</span>
                      <span className="font-bold text-[#1c1c1a] font-mono">{totalOriginal.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>소소 우대 혜택 할인 :</span>
                      <span className="font-bold text-emerald-600 font-mono">-{discountTotal.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>배송 수령 편의비 :</span>
                      <span className="font-bold text-[#1c1c1a] font-mono">
                        {shippingFee === 0 ? '무료배송 ✨' : `${shippingFee.toLocaleString()}원`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-[#1c1c1a] pt-3 border-t border-[#f4f1ea]">
                      <span className="font-bold">당신이 전할 결제 총액:</span>
                      <span className="font-extrabold text-base text-[#d06a4c] font-display font-mono">
                        {estimatedTotal.toLocaleString()}원
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#d06a4c] text-white py-4 rounded-xl font-bold text-xs tracking-wider shadow-md shadow-[#d06a4c]/30 hover:bg-[#b05236] transition-transform hover:scale-102 cursor-pointer"
                    id="submit-order-final-btn"
                  >
                    {estimatedTotal.toLocaleString()}원 안전 모의결제하기 🎉
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Confirmation ordered page view layout */}
          {currentView === 'confirmation' && activeOrder && (
            <motion.div
              key="confirmation-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-xl mx-auto px-4 py-16 text-center space-y-10"
              id="order-confirmation-box"
            >
              {/* Graphic greeting card */}
              <div className="bg-white border border-[#f4f1ea]/80 rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-2 bg-[#d06a4c]"></div>
                
                {/* Visual success logo */}
                <div className="w-16 h-16 rounded-full bg-[#d06a4c]/10 text-[#d06a4c] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-9 h-9 fill-current" />
                </div>

                <div className="space-y-2">
                  <h1 className="font-display font-black text-2xl text-[#1c1c1a]">소소한 행복이 곧 찾아옵니다! 🎉</h1>
                  <p className="text-xs text-[#7c7267] leading-relaxed">
                    당신의 소중한 반려가족을 위해 가장 안심할 수 있는 패킹 스테이지에서 삼중 점검을 마친 뒤 우주에서 제일 빠른 속도로 택배박스를 칼같이 날리겠습니다.
                  </p>
                </div>

                {/* Status estimated delivery tracking bar */}
                <div className="py-4 border-t border-b border-[#f4f1ea] space-y-3">
                  <p className="text-[11px] font-bold text-[#7c7267] tracking-wider uppercase text-left">실시간 모의 입출고 상태</p>
                  
                  {/* Flow tracker dot line */}
                  <div className="flex justify-between items-center text-[10px] font-extrabold text-[#7c7267]">
                    <span className="text-[#d06a4c] flex flex-col items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d06a4c]"></span>
                      주문완료
                    </span>
                    <span className="flex flex-col items-center gap-1 opacity-40">
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                      상품준비중
                    </span>
                    <span className="flex flex-col items-center gap-1 opacity-40">
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                      칼배송출발
                    </span>
                    <span className="flex flex-col items-center gap-1 opacity-40">
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                      안심배송기뻐요
                    </span>
                  </div>

                  <div className="w-full h-1 bg-[#e2dfd9] rounded-full relative mt-1 overflow-hidden">
                    <div className="h-full bg-[#d06a4c] w-1/4 absolute left-0" />
                  </div>
                </div>

                {/* Billing Summary breakdown information */}
                <div className="text-left space-y-2.5 text-xs text-[#7c7267] bg-[#fbfbf9] p-4 rounded-xl border border-[#f4f1ea]">
                  <div className="flex justify-between">
                    <span className="font-bold">주문 일련 식별번호:</span>
                    <span className="font-mono text-[#1c1c1a] font-black">{activeOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>안전 수령 보호자명:</span>
                    <span className="text-[#1c1c1a] font-semibold">{activeOrder.shippingAddress.recipient} / {activeOrder.shippingAddress.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>배송 배달 도착지:</span>
                    <span className="text-[#1c1c1a] font-semibold text-right max-w-[220px] line-clamp-1">{activeOrder.shippingAddress.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>기사님 대기 메모:</span>
                    <span className="text-[#1c1c1a] font-semibold">{activeOrder.shippingAddress.request}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#f4f1ea] pt-2 mt-2">
                    <span className="font-bold text-[#1c1c1a]">총 기부 결제액:</span>
                    <span className="text-sm font-extrabold text-[#d06a4c] font-display font-mono">{activeOrder.totalPayment.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              {/* Supporting action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    navigateTo('home');
                  }}
                  className="w-full sm:w-auto bg-[#d06a4c] text-white px-8 py-3.5 rounded-xl text-xs font-bold transition-transform hover:scale-105 shadow-md shadow-[#d06a4c]/20"
                >
                  보물사냥터 홈으로 복귀 🦴
                </button>
                
                <button
                  onClick={() => {
                    navigateTo('all-reviews');
                    setTimeout(() => {
                      setShowReviewModal(true);
                    }, 200);
                  }}
                  className="w-full sm:w-auto bg-transparent border border-[#7c7267] text-[#1c1c1a] hover:bg-[#7c7267]/10 px-6 py-3.5 rounded-xl text-xs font-bold transition-all"
                >
                  포인트 적립 리뷰 쓰러가기 ✍️
                </button>
              </div>
            </motion.div>
          )}

          {/* All Reviews Archival timeline screen */}
          {currentView === 'all-reviews' && (
            <motion.div
              key="all-reviews-timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10"
            >
              {/* Back breadcrumb and info */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#f4f1ea] pb-5 text-left">
                <div className="space-y-1">
                  <button
                    onClick={() => navigateTo('home')}
                    className="inline-flex items-center gap-1.5 text-xs text-[#7c7267] hover:text-[#1c1c1a] group mb-1 font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>홈보물창고 돌아가기</span>
                  </button>
                  <h1 className="font-display font-black text-2xl text-[#1c1c1a]">리뷰 실시간 해피 타임라인 ✨</h1>
                  <p className="text-xs text-[#7c7267]">모든 반려견과 반려묘들의 솔직한 꼬리 흔들림 만족도 모음지</p>
                </div>

                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-[#d06a4c] text-white hover:bg-[#b05236] px-5 py-2.5 rounded-full text-xs font-extrabold shadow-sm transition-colors cursor-pointer"
                >
                  직접 소소 경험담 작성하기 ✍️
                </button>
              </div>

              {/* Filtering bar section */}
              <div className="bg-white p-5 rounded-2xl border border-[#f4f1ea] grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {/* Search query */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#7c7267] tracking-wider uppercase">검색 텍스트 필터</label>
                  <input
                    type="text"
                    placeholder="작성자, 상품명, 후기 내용 검색"
                    value={timelineSearchQuery}
                    onChange={(e) => setTimelineSearchQuery(e.target.value)}
                    className="w-full bg-[#f4f1ea] border border-[#e2dfd9] rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#d06a4c] text-[#1c1c1a]"
                  />
                </div>

                {/* Rating filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#7c7267] tracking-wider uppercase">별점 만족도 점수</label>
                  <div className="flex gap-1">
                    {[
                      { k: 'all', l: '전체 별점' },
                      { k: '5', l: '⭐ 5점만점' },
                      { k: '4', l: '⭐ 4점만독' }
                    ].map((btn) => (
                      <button
                        key={btn.k}
                        type="button"
                        onClick={() => setTimelineRatingFilter(btn.k as any)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          timelineRatingFilter === btn.k
                            ? 'bg-[#d06a4c] text-white shadow-xs'
                            : 'bg-[#f4f1ea] hover:bg-[#e2dfd9] text-[#7c7267]'
                        }`}
                      >
                        {btn.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sorter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#7c7267] tracking-wider uppercase">기본 정렬 기준</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTimelineSort('latest')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        timelineSort === 'latest'
                          ? 'bg-[#d06a4c] text-white shadow-xs'
                          : 'bg-[#f4f1ea] hover:bg-[#e2dfd9] text-[#7c7267]'
                      }`}
                    >
                      최신 한 줄 일지순
                    </button>
                    <button
                      onClick={() => setTimelineSort('helpful')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        timelineSort === 'helpful'
                          ? 'bg-[#d06a4c] text-white shadow-xs'
                          : 'bg-[#f4f1ea] hover:bg-[#e2dfd9] text-[#7c7267]'
                      }`}
                    >
                      도움 추천/공감순
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid timeline items */}
              {filteredTimelineReviews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-[#f4f1ea]">
                  <p className="text-xs text-[#7c7267]">검색 필터에 일치하는 조그만 후기가 없습니다 🌱</p>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  {filteredTimelineReviews.map((rev) => (
                    <div
                      key={rev.id}
                      onClick={() => {
                        if (rev.productId) {
                          navigateTo('product', rev.productId);
                        }
                      }}
                      className="bg-white hover:bg-[#fbfbf9] rounded-2xl border border-[#f4f1ea] p-5 sm:p-6 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1.5">
                          <p className="text-xs font-bold text-[#d06a4c] tracking-tight hover:underline flex items-center gap-1">
                            <span>📦 관련 상품: {rev.productName}</span>
                          </p>
                          <div className="flex items-center gap-2 text-xs text-[#7c7267]">
                            <span className="font-bold text-[#1c1c1a]">{rev.author}</span>
                            <span className="text-[#a8a196] font-mono">({rev.date})</span>
                          </div>
                          
                          {/* Stars */}
                          <div className="flex items-center text-amber-400">
                            {Array.from({ length: 5 }).map((_, si) => (
                              <Star key={si} className={`w-3.5 h-3.5 ${si < rev.rating ? 'fill-current' : 'text-gray-200'}`} />
                            ))}
                          </div>
                        </div>

                        {rev.options && (
                          <span className="bg-[#f4f1ea] text-[#7c7267] text-[10px] px-2.5 py-1 rounded-md font-medium">
                            {rev.options}
                          </span>
                        )}
                      </div>

                      {/* Review body */}
                      <div className="flex flex-col sm:flex-row gap-5 items-start mt-4">
                        {rev.image && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-[#f4f1ea]">
                            <img src={rev.image} alt="User review asset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        <p className="text-xs sm:text-sm text-[#1c1c1a] leading-relaxed flex-1">
                          {rev.content}
                        </p>
                      </div>

                      {/* Helpful like button */}
                      <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#f4f1ea]/65 text-xs text-[#7c7267]">
                        <span className="text-[10px] font-mono text-[#a8a196]">클릭하여 이 보물 상세 보기 🐾</span>
                        
                        <button
                          onClick={(e) => handleLikeReview(rev.id, e)}
                          className="inline-flex items-center gap-1 text-[#7c7267] hover:text-[#d06a4c] font-semibold bg-[#f4f1ea] px-3 py-1.5 rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-[#d06a4c]" />
                          <span>도움 백퍼 공감 ({rev.likes})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Write Review Systemic Modal overlays */}
      <AnimatePresence>
        {showReviewModal && (
          <ReviewModal
            products={products}
            onClose={() => setShowReviewModal(false)}
            onSubmitReview={handleSubmitReview}
            initialProductId={selectedProductId || undefined}
          />
        )}
      </AnimatePresence>

      {/* Main Footer Component */}
      <Footer onNavigate={(view) => navigateTo(view)} />
    </div>
  );
}
