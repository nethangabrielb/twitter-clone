import type { Metadata } from "next";

import { Inter } from "next/font/google";

import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

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
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className={`antialiased h-svh bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
