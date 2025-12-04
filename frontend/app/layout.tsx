// frontend/app/layout.tsx

import type { Metadata } from "next";
// 1. Import các font đã định nghĩa
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 2. Import component Header và Footer
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer'; 

// --- Định nghĩa Font ---
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- Metadata ---
export const metadata: Metadata = {
  title: "Movie Ticket App", // Đổi tên cho phù hợp
  description: "Quản lý và đặt vé xem phim trực tuyến",
};

// --- Component RootLayout ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi"> {/* Đổi ngôn ngữ sang tiếng Việt */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 3. Đặt Header ở đầu trang */}
        <Header /> 

        {/* 4. Đặt nội dung trang (children) bên trong thẻ <main> */}
        <main className="min-h-screen container mx-auto px-4 py-8">
            {children}
        </main>
        
        {/* 5. Đặt Footer ở cuối trang */}
        <Footer /> 

      </body>
    </html>
  );
}