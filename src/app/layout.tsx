import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import ContentLayout from "./ContentLayout";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "دليلي البحرين | Dalily BH - اكتشف البحرين",
  description:
    "اكتشف أماكن البحرين من مطاعم وفنادق ومستشفيات ومدارس والمزيد. منصة شاملة للبيانات المفتوحة. Discover Bahrain's places - restaurants, hotels, hospitals, schools and more.",
  keywords:
    "Bahrain, البحرين, open data, بيانات مفتوحة, restaurants, hotels, map, خريطة",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        />
      </head>
      <body className={`${inter.variable} ${notoSansArabic.variable}`}>
        <ContentLayout>{children}</ContentLayout>
      </body>
    </html>
  );
}
