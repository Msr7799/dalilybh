"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLogoClick?: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  onLogoClick,
}: HeaderProps) {
  const { lang, toggleLanguage, t, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, loading, signInWithGoogle, logout } = useAuth();

  return (
    <header className="header">
      <button
        className="header-logo"
        type="button"
        onClick={onLogoClick}
        aria-label={t("home")}
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={32}
          height={32}
          className="header-logo-icon"
          style={{ objectFit: "contain", background: "transparent" }}
        />
        <div className="header-logo-text">
          <h1>{t("appName")}</h1>
          <span>{t("appSlogan")}</span>
        </div>
      </button>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          dir={isRTL ? "rtl" : "ltr"}
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="header-actions">
        <button
          className="btn-icon"
          onClick={user ? logout : signInWithGoogle}
          disabled={loading}
          aria-label={user ? "Sign out" : "Sign in with Google"}
          title={user ? "Sign out" : "Sign in with Google"}
        >
          {user ? (
            user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "User"}
                width={20}
                height={20}
                style={{ borderRadius: 999, objectFit: "cover" }}
              />
            ) : (
              "�"
            )
          ) : (
            "G"
          )}
        </button>
        <button
          className="btn-icon"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Dark Mode" : "Light Mode"}
          title={theme === "light" ? "Dark Mode" : "Light Mode"}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <button
          className="btn-icon lang-toggle"
          onClick={toggleLanguage}
          aria-label={lang === "ar" ? "English" : "العربية"}
          title={lang === "ar" ? "English" : "العربية"}
        >
          {lang === "ar" ? "EN" : "ع"}
        </button>
      </div>
    </header>
  );
}
