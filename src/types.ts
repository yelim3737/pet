export interface ProductOption {
  type: 'color' | 'size' | 'design';
  name: string;
  values: string[];
  descriptions?: string[];
}

export interface Product {
  id: string;
  name: string;
  englishName: string;
  category: 'clothing' | 'toy' | 'treat' | 'living' | 'walk';
  categoryKo: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  additionalImages: string[];
  badge?: string;
  description: string;
  descriptionLong: string;
  options?: ProductOption[];
  highlights: string[];
}

export interface Review {
  id: string;
  productId?: string;
  productName?: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  image?: string;
  petInfo?: string;
  likes: number;
  options?: string;
}

export interface CartItem {
  id: string; // productId + '-' + selectedOptionsKey
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedType?: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: {
    recipient: string;
    phone: string;
    address: string;
    request: string;
  };
  paymentMethod: 'card' | 'kakaopay' | 'naverpay';
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalPayment: number;
  status: 'preparing' | 'ready_for_shipping' | 'shipping' | 'delivered';
}

export type CategoryKey = 'all' | 'clothing' | 'toy' | 'treat' | 'living' | 'walk';
