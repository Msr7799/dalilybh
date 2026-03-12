"use client";

import AppLoader from "@/components/AppLoader";
import { AnimatePresence } from "framer-motion";
import { ReactNode, useCallback, useEffect, useState } from "react";

export default function LoadingWrapper({ children }: { children: ReactNode }) {
  // نبدأ بـ false حتى نُظهر اللودر
  const [isLoaded, setIsLoaded] = useState(false);

  // حل مشكلة Hydration/SSR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // نتحقق إذا كان قد تم عرضه سابقاً في هذه الجلسة
    const shown = sessionStorage.getItem("loader_shown");
    if (shown) {
      setIsLoaded(true);
    }
  }, []);

  const handleComplete = useCallback(() => {
    setIsLoaded(true);
    sessionStorage.setItem("loader_shown", "true");
  }, []);

  // منع ظهور فجوة Hydration
  if (!isMounted) return null;

  return (
    <>
      <AnimatePresence>
        {!isLoaded && <AppLoader onComplete={handleComplete} />}
      </AnimatePresence>

      {/* عرض المحتوى فقط بعد اكتمال التحميل */}
      <div
        className="loading-wrapper-content"
        data-loaded={isLoaded ? "true" : "false"}
      >
        {children}
      </div>
    </>
  );
}
