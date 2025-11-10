import type { Metadata } from "next";
import { Toaster } from "sonner";

import { Inter } from "next/font/google";

import Sidebar from "@/components/sidebar";

import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Twitter Clone",
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
        <Toaster position="top-center" richColors />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Sidebar>{children}</Sidebar>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
