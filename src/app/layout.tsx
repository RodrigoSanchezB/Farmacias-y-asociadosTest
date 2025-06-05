import ToastWrapper from "./components/ToastWrapper";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Farmacias y Asociados",
  description: "Comparador de precios de medicamentos",
};

import { LanguageProvider } from "@/app/context/LanguageContext"; // ✅ Ruta corregida

// ...resto de imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <Header />
          {children}
          <ToastWrapper />
        </LanguageProvider>
      </body>
    </html>
  );
}
