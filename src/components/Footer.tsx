import React from 'react';
import { PawPrint, Heart, Sparkles, MapPin, Phone, HelpCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'cart' | 'all-reviews') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#f4f1ea] border-t border-[#e2dfd9] text-[#7c7267] pt-16 pb-12" id="footer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#d06a4c] flex items-center justify-center text-white">
                <PawPrint className="w-4 h-4 fill-current" />
              </div>
              <span className="font-display font-bold text-[#1c1c1a] tracking-wider text-base">소소한 펫 (Sosohan Pets)</span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              우리는 세상의 모든 작은 생명들 안에 깃든 커다란 세상을 마주합니다. 화려한 수식어가 없어도 충분히 아름다운 그 아이들의 영특하고 포근한 일상에 가장 확실한 조각을 채웁니다.
            </p>
            <div className="flex items-center gap-3 text-xs pt-1">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#d06a4c]" /> 서울특별시 성동구 성수동 소소 빌딩 201호</span>
            </div>
            <p className="text-[10px] font-mono text-[#a8a196]">
              © 2026 SOSOHAN PETS CO. ALL RIGHTS RESERVED.
            </p>
          </div>

          {/* Col 2: Customer Center */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#1c1c1a] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#d06a4c]" />
              행복 고객 만족 데스크
            </h4>
            <div className="space-y-1.5 text-xs text-[#7c7267]">
              <p className="font-mono text-base font-bold text-[#1c1c1a]">1644-5504</p>
              <p>운영 시간: 오전 10:00 - 오후 05:00</p>
              <p>점심 시간: 오후 12:30 - 오후 01:30</p>
              <p>주말 & 공휴일 휴무로 아가와 산책을 나갑니다 🌤️</p>
              <p className="hover:underline cursor-pointer flex items-center gap-1 mt-2 text-[#d06a4c] font-medium">
                <HelpCircle className="w-3 h-3" /> 실시간 1:1 산책 톡 문의
              </p>
            </div>
          </div>

          {/* Col 3: Simulated Bank Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#1c1c1a] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d06a4c]" />
              가이드라인 & 결제구좌
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <p className="font-medium text-[#1c1c1a]">무통장 실시간 입금 계좌</p>
                <p className="font-mono mt-0.5">카카오뱅크 <span className="font-bold">3333-14-9923485</span></p>
                <p className="font-medium text-[#7c7267]">예금주: 주식회사 소소한펫</p>
              </div>
              <div className="pt-2 border-t border-[#e2dfd9] text-[11px] space-y-1 text-[#a8a196]">
                <p>사업자등록번호: 211-85-11928</p>
                <p>통신판매업신고: 제 2026-서울성동-0129호</p>
                <p>대표자: 최소소 (hello@sosohanpets.co)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#e2dfd9]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[#7c7267]">
            <a href="#terms" className="hover:text-[#1c1c1a] hover:underline">회사소개</a>
            <a href="#terms" className="hover:text-[#1c1c1a] hover:underline font-bold text-[#d06a4c]">개인정보처리방침</a>
            <a href="#terms" className="hover:text-[#1c1c1a] hover:underline">이용약관</a>
            <a href="#terms" className="hover:text-[#1c1c1a] hover:underline">입점문의</a>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#a8a196]">
            <span>우리의 소소한 가치가 당신에게 닿길 바랍니다</span>
            <Heart className="w-3 h-3 text-[#d06a4c] fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
}
