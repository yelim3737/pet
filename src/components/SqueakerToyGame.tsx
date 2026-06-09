import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SqueakerToyGame() {
  const [squeakCount, setSqueakCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeBubbles, setActiveBubbles] = useState<{ id: number; x: number; y: number; text: string }[]>();
  const [toyState, setToyState] = useState<'idle' | 'squeaked'>('idle');

  // Comic text for squeaks
  const comicTexts = ['바스락!', '삑!!', '삑삑!', '바시락💨', '삑꾹!', '신난당🐾'];

  // Sound Synth utilizing Native browser AudioContext
  const playSqueakSound = () => {
    if (!soundEnabled) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      
      // Squeaker is a high pitched fast frequency sweep
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      
      // High pitch squeak sweep from 700Hz to 1800Hz then down to 1000Hz very quickly
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1900, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.18);

      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Audio Context is blocked or not supported yet.', e);
    }
  };

  const handleSqueak = (e: React.MouseEvent<HTMLButtonElement>) => {
    setToyState('squeaked');
    setSqueakCount((prev) => prev + 1);
    playSqueakSound();

    // Spawning a visual text bubble
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + (Math.random() * 40 - 20);
    const y = e.clientY - rect.top - 20;
    const text = comicTexts[Math.floor(Math.random() * comicTexts.length)];

    const newBubble = {
      id: Date.now(),
      x,
      y,
      text
    };

    setActiveBubbles((prev) => [...(prev || []), newBubble]);

    // Cleanup bubble after a second
    setTimeout(() => {
      setActiveBubbles((prev) => (prev || []).filter((b) => b.id !== newBubble.id));
    }, 900);

    // Reset toy image visual state
    setTimeout(() => {
      setToyState('idle');
    }, 150);
  };

  const getPupStatus = () => {
    if (squeakCount === 0) return '장난감을 삑삑 눌러 놀아주세요!';
    if (squeakCount < 5) return '🐶 아이가 귀를 쫑긋거리며 집중해요!';
    if (squeakCount < 10) return '🐕 꼬리를 정성껏 살랑살랑 흔들기 시작합니다!';
    if (squeakCount < 20) return '✨ 눈이 초롱초롱해지면서 제자리 방방 뛰어다녀요!';
    return '🏃‍♂️💨 신이 과하게 나서 거실 전체를 우다다다 질주합니다!!!';
  };

  return (
    <div className="bg-[#f4f1ea]/60 rounded-3xl p-6 border border-[#e2dfd9]/80 max-w-md mx-auto" id="squeaker-sim-box">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#7c7267] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#d06a4c]" />
          러블리 삑삑이 사운드 체험실
        </span>
        
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded-full hover:bg-[#e2dfd9] text-[#7c7267] transition-colors cursor-pointer"
          title={soundEnabled ? '무음 켜기' : '사운드 켜기'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-[#d06a4c]" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      <p className="text-xs text-[#7c7267] leading-relaxed mb-6">
        파스텔 당근 모양을 마구 클릭해보세요! 실제 아이가 들을 수 있는 실시간 삑삑 소리를 고스란히 재현했습니다. 🔊
      </p>

      {/* Squeak canvas core */}
      <div className="relative h-64 bg-white rounded-2xl border border-[#e2dfd9]/40 flex items-center justify-center overflow-hidden shadow-inner">
        {/* Animated text bubbles layer */}
        <AnimatePresence>
          {activeBubbles?.map((bubble) => (
            <motion.div
              key={bubble.id}
              initial={{ scale: 0.4, opacity: 0, y: bubble.y }}
              animate={{ scale: 1.1, opacity: 1, y: bubble.y - 60 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute pointer-events-none text-xs font-bold text-[#d06a4c] bg-[#fbfbf9] px-2 py-1 rounded-full border border-[#d06a4c]/20 shadow-xs z-20"
              style={{ left: bubble.x }}
            >
              {bubble.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Large Interactive Squeaking Carrot Button */}
        <motion.button
          onClick={handleSqueak}
          animate={toyState === 'squeaked' ? {
            scale: [1, 0.85, 1.05, 1],
            rotate: [0, -8, 8, 0]
          } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.18 }}
          className="w-44 h-44 cursor-pointer focus:outline-none focus:ring-0 active:scale-95 transition-all relative group flex items-center justify-center"
          id="carrot-toy-squeaker"
        >
          {/* Radial glow effect */}
          <div className="absolute inset-2 bg-[#d06a4c]/10 rounded-full group-hover:scale-115 transition-transform duration-500 blur-xl"></div>
          
          {/* Vector / Styled Carrot Toy */}
          <span className="text-8xl select-none filter drop-shadow-md group-hover:rotate-6 transition-transform">
            🥕
          </span>

          <span className="absolute bottom-6 bg-[#1a1a1a]/70 text-[#fbfbf9] px-2.5 py-0.5 rounded-full text-[10px] font-bold group-hover:opacity-100 opacity-60 transition-opacity">
            눌러봐! 삑!
          </span>
        </motion.button>
      </div>

      {/* Squeak progress dashboard */}
      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#7c7267] font-medium flex items-center gap-1">
            <Smile className="w-3.5 h-3.5 text-[#d06a4c]" /> Squeak 갯수:
          </span>
          <span className="font-mono font-bold text-[#d06a4c] bg-[#f4f1ea] px-2 py-0.5 rounded-md">
            {squeakCount}회 돌파 ✨
          </span>
        </div>

        {/* Level bar */}
        <div className="w-full h-1.5 bg-[#e2dfd9] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#d06a4c]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((squeakCount / 20) * 100, 100)}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Reaction status card */}
        <div className="bg-[#fbfbf9] rounded-xl p-3 border border-[#e2dfd9]/40 text-center">
          <p className="text-xs font-semibold text-[#1c1c1a] transition-all">
            {getPupStatus()}
          </p>
        </div>
      </div>
    </div>
  );
}
