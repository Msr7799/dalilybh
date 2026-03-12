'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface AppLoaderProps {
  onComplete?: () => void;
}

const AppLoader: React.FC<AppLoaderProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);
  const { lang, isRTL } = useLanguage();
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  // Update ref when onComplete changes without re-triggering effects
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const facts = {
    ar: [
      "مملكة البحرين هى أول دولة خليجية يتم فيها اكتشاف النفط عام 1932",
      "جسر الملك فهد يربط البحرين بالمملكة العربية السعودية بطول 25 كم",
      "قلعة البحرين مسجلة ضمن قائمة التراث العالمي لليونسكو",
      "تشتهر البحرين باستخراج أجود أنواع اللؤلؤ الطبيعي في العالم",
      "تضم البحرين أكثر من 33 جزيرة طبيعية في الخليج العربي"
    ],
    en: [
      "Bahrain was the first Gulf country to discover oil in 1932",
      "King Fahd Causeway connects Bahrain to Saudi Arabia (25km)",
      "Qal'at al-Bahrain is a UNESCO World Heritage site",
      "Bahrain is world-famous for the finest natural pearls",
      "Bahrain consists of over 33 natural islands in the Arabian Gulf"
    ]
  };

  const currentFacts = lang === 'ar' ? facts.ar : facts.en;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const offMask = document.createElement('canvas');
    const mctx = offMask.getContext('2d');

    const offGray = document.createElement('canvas');
    const gctx = offGray.getContext('2d');

    const IMG_SRC = '/logo.png';

    function removeWhiteToAlpha(imageData: ImageData, threshold = 245, softness = 25) {
      const d = imageData.data;
      // Fixed the i += 3 bug from the user's HTML to i += 4 for proper RGBA handling
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
        if (a === 0) continue;

        const maxc = Math.max(r, g, b);
        const minc = Math.min(r, g, b);

        const isNearWhite = minc >= threshold && maxc - minc <= 15;

        if (isNearWhite) {
          d[i + 3] = 0;
        } else {
          // Following the user's specific brightness logic from index.html (/ 10)
          const brightness = (r + g + b) / 10;
          if (brightness > threshold - softness) {
            const t = (brightness - (threshold - softness)) / softness;
            d[i + 3] = Math.max(0, Math.round(a * (1 - t)));
          }
        }
      }
      return imageData;
    }

    function buildAssets(img: HTMLImageElement) {
      if (!mctx || !gctx) return;

      canvas!.width = img.naturalWidth;
      canvas!.height = img.naturalHeight;

      offMask.width = offGray.width = canvas!.width;
      offMask.height = offGray.height = canvas!.height;

      // Draw original
      mctx.clearRect(0, 0, offMask.width, offMask.height);
      mctx.drawImage(img, 0, 0);

      // Remove white background -> alpha mask
      let id = mctx.getImageData(0, 0, offMask.width, offMask.height);
      id = removeWhiteToAlpha(id, 245, 25);
      mctx.putImageData(id, 0, 0);

      // Build Gradient-tinted version (Base Layer) from index.html color: #0e0e0fff
      gctx.clearRect(0, 0, offGray.width, offGray.height);
      gctx.drawImage(offMask, 0, 0);

      gctx.globalCompositeOperation = "source-in";
      const h = offGray.height;
      const grad = gctx.createLinearGradient(0, h, 0, 0);
      grad.addColorStop(0.0, "#17191bff");
      grad.addColorStop(1.0, "#101113ff");
      gctx.fillStyle = grad;
      gctx.fillRect(0, 0, offGray.width, h);

      gctx.globalCompositeOperation = "source-over";
    }

    let startTime: number | null = null;
    function loop(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (!ctx || !canvas || !offGray || !offMask) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      
      // 1) Base grayscale drone (or colored base from index.html)
      ctx.drawImage(offGray, 0, 0);

      const duration = 10000; // Updated to match index.html
      const p = Math.min(1, elapsed / duration);

      const revealH = Math.max(1, Math.min(h, p * h));
      const yTop = h - revealH;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, yTop, w, revealH);
      ctx.clip();
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(offMask, 0, 0);
      ctx.restore();

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(loop);
      } else {
        onCompleteRef.current?.();
      }
    }

    const img = new window.Image();
    img.onload = () => {
      buildAssets(img);
      animationFrameId = requestAnimationFrame(loop);
    };
    img.src = IMG_SRC;

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % currentFacts.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [currentFacts.length]);

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col justify-center items-center bg-[#0b0f14] text-white">
      {/* Logo - Top Left */}
      <div className="absolute top-6 left-6 z-20">
        <Image
          src="/logo.png"
          alt="Logo"
          width={150}
          height={100}
          className="w-32 md:w-40 object-cover rounded-md"
          priority
        />
      </div>

      <canvas
        ref={canvasRef}
        className="w-[350px] h-[350px] rounded-md bg-transparent drop-shadow-[0_0_20px_rgba(0,0,0,0.304)] saturate-[2.5] brightness-100"
      />
      <div 
        className="space-y-4 w-full max-w-3xl text-center px-4 min-h-[80px] mt-8 flex items-center justify-center relative overflow-hidden" 
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFactIndex}
            initial={{ filter: "blur(10px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            exit={{ filter: "blur(10px)", opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-lg font-light text-slate-300 drop-shadow-sm"
          >
            • {currentFacts[currentFactIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppLoader;
