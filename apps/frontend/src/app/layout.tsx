import type { Metadata } from "next";

import { Inter } from "next/font/google";

import QueryProvider from "@/providers/query-provider";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next-Express Template",
  description:
    "Simple, modern opinionated monorepo template with Next.js and Express.js using TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className={`antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
