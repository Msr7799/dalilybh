'use client';

import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import LoadingWrapper from "@/components/LoadingWrapper";
import "./globals.css";

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LoadingWrapper>{children}</LoadingWrapper>
      </LanguageProvider>
    </ThemeProvider>
  );
}
