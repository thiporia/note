import type { Metadata } from "next";
import localFont from "next/font/local";

import "modern-normalize/modern-normalize.css";
import "highlight.js/styles/github.css";

import "./assets/styles/reset.css";
import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Content from "@/components/layout/Content";

const font = localFont({
  src: [
    {
      path: "./assets/fonts/PretendardVariable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thiporia's notes",
  description: "기록",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={font.className}>
      <body className="relative w-full">
        <Header />
        <Content>{children}</Content>
        <Footer />
      </body>
    </html>
  );
}
