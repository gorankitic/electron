// next
import type { Metadata } from "next";
// components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// styles
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Electron",
  description: "Ecommerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased flex flex-col h-screen text-gray-700 max-w-7xl mx-auto px-5 md:px-10 w-full`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html >
  );
}
