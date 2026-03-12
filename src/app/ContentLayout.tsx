"use client";

import LoadingWrapper from "@/components/LoadingWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <LoadingWrapper>{children}</LoadingWrapper>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
