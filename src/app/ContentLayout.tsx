"use client";

import LoadingWrapper from "@/components/LoadingWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
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
        <FavoritesProvider>
          <LanguageProvider>
            <LoadingWrapper>{children}</LoadingWrapper>
          </LanguageProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
