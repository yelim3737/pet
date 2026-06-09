import React, { useState } from 'react';
import { X, Star, Upload, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, Review } from '../types';

interface ReviewModalProps {
  products: Product[];
  onClose: () => void;
  onSubmitReview: (review: Review) => void;
  initialProductId?: string;
}

export default function ReviewModal({ products, onClose, onSubmitReview, initialProductId }: ReviewModalProps) {
  const [selectedProductId, setSelectedProductId] = useState(initialProductId || products[0]?.id || '');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [petInfo, setPetInfo] = useState('');
  const [content, setContent] = useState('');
  const [selectOptions, setSelectOptions] = useState('');
  const [image, setImage] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Form errors
  const [error, setError] = useState('');

  // Handle mock image upload via drag-drop / click
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const getRandomPetPhoto = () => {
    const photos = [
      '/src/assets/images/insta1_white_puppy_1780996526397.png',
      '/src/assets/images/insta2_white_puppy_1780996540069.png',
      '/src/assets/images/insta3_white_puppy_1780996554923.png',
      '/src/assets/images/hero_white_puppy_1780996428332.png'
    ];
    return photos[Math.floor(Math.random() * photos.length)];
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // For presentation purposes, use a random premium pet photo
      setImage(getRandomPetPhoto());
    }
  };

  const handleManualUpload = () => {
    setImage(getRandomPetPhoto());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!author.trim()) {
      setError('보호자 닉네임을 입력해 주세요.');
      return;
    }
    if (!petInfo.trim()) {
      setError('반려아이 정보(예: 푸들 3.5kg)를 입력해 주세요.');
      return;
    }
    if (content.trim().length < 10) {
      setError('아이들을 위해 솔직한 의견을 10자 이상 남겨주세요.');
      return;
    }

    const currentProduct = products.find((p) => p.id === selectedProductId);

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      productId: selectedProductId,
      productName: currentProduct?.name || '소소한 상품',
      author,
      rating,
      date: new Date().toISOString().split('T')[0],
      content,
      image: image || undefined,
      petInfo,
      likes: 0,
      options: selectOptions ? selectOptions : undefined
    };

    onSubmitReview(newReview);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-[#1c1c1a]/50 backdrop-blur-xs" id="review-modal-box">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#fbfbf9] w-full max-w-lg rounded-3xl border border-[#e2dfd9] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header line */}
        <div className="px-6 py-5 border-b border-[#f4f1ea] flex items-center justify-between bg-white">
          <div className="flex items-center gap-1.5 font-bold text-[#1c1c1a]">
            <span>소소한 후기 쓰기 ✍️</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#7c7267] hover:bg-[#f4f1ea] hover:text-[#1c1c1a] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs py-2.5 px-4 rounded-xl font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Product Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#7c7267] tracking-wide">리뷰할 상품</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-[#f4f1ea] text-xs font-semibold text-[#1c1c1a] border border-[#e2dfd9] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#d06a4c]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Nickname */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#7c7267] tracking-wide">보호자 닉네임</label>
              <input
                type="text"
                placeholder="예: 지율맘"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#f4f1ea] text-xs font-medium text-[#1c1c1a] border border-[#e2dfd9] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#d06a4c]"
              />
            </div>

            {/* Pet Info */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#7c7267] tracking-wide">반려아이 정보</label>
              <input
                type="text"
                placeholder="예: 말티즈 2.4kg"
                value={petInfo}
                onChange={(e) => setPetInfo(e.target.value)}
                className="w-full bg-[#f4f1ea] text-xs font-medium text-[#1c1c1a] border border-[#e2dfd9] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#d06a4c]"
              />
            </div>
          </div>

          {/* Option details */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#7c7267] tracking-wide">주문한 옵션 (선택)</label>
            <input
              type="text"
              placeholder="예: 색상: 파우더 핑크 / 사이즈: M"
              value={selectOptions}
              onChange={(e) => setSelectOptions(e.target.value)}
              className="w-full bg-[#f4f1ea] text-xs font-medium text-[#1c1c1a] border border-[#e2dfd9] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#d06a4c]"
            />
          </div>

          {/* Stars */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#7c7267] tracking-wide block">아이가 만족한 별점</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition-transform active:scale-90"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'text-amber-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold font-mono text-[#7c7267] ml-2">가장 우수한 별점: {rating}점</span>
            </div>
          </div>

          {/* Drag & Drop Photo upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#7c7267] tracking-wide block">리뷰 사진 첨부</label>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={handleManualUpload}
              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-[#d06a4c] bg-[#d06a4c]/5'
                  : image
                  ? 'border-emerald-500 bg-emerald-50/10'
                  : 'border-[#e2dfd9] hover:border-[#7c7267] bg-white'
              }`}
            >
              {image ? (
                <div className="flex items-center gap-3 w-full">
                  <img
                    src={image}
                    alt="Uploaded pet"
                    className="w-12 h-12 object-cover rounded-lg border border-[#e2dfd9]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 text-left">
                    <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 이미지가 성공적으로 업로드되었습니다!
                    </p>
                    <p className="text-[10px] text-[#7c7267]">클릭하여 다른 사진으로 교체</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-[#7c7267] mb-1.5" />
                  <p className="text-[11px] font-semibold text-[#1c1c1a]">드래그하여 후기 사진을 놓으세요</p>
                  <p className="text-[10px] text-[#7c7267]">또는 여기를 가볍게 클릭하여 모의 사진 등록</p>
                </>
              )}
            </div>
          </div>

          {/* Text reviews */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#7c7267] tracking-wide leading-none">솔직한 체험 후기</label>
            <textarea
              rows={4}
              placeholder="리뷰 글은 최소 10자 이상 작성해 주세요. 사랑하는 아이들에게 엄청난 행복 수면 팁이 됩니다 ✨"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#f4f1ea] text-xs font-medium text-[#1c1c1a] border border-[#e2dfd9] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#d06a4c] resize-none"
            />
          </div>

          {/* Form Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#d06a4c] text-white py-3.5 rounded-xl font-bold text-xs tracking-wider shadow-md shadow-[#d06a4c]/30 hover:bg-[#b05236] transition-colors cursor-pointer mt-2"
          >
            소소한 후기 무료 등록 및 포인트 적립하기
          </button>
        </form>
      </motion.div>
    </div>
  );
}
