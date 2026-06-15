import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaveBackground from "@/components/WaveBackground";
import FloatingTshirts from "@/components/FloatingTshirts";
import LoadingScreen from "@/components/LoadingScreen";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Terra Fit | Premium Activewear",
  description: "Premium eCommerce app for activewear, shoes, and high-performance apparel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <LoadingScreen />
        <WaveBackground />
        <FloatingTshirts />
        <CartProvider>
          <Navbar />
          <main style={{ flex: 1, paddingBottom: "2rem", position: "relative", zIndex: 1 }}>
            {children}
          </main>
          <Footer />
        </CartProvider>
        <Script 
          src="https://accounts.google.com/gsi/client" 
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

