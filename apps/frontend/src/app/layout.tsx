import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

import { Inter } from "next/font/google";

import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";

import HealthGate from "@/providers/health-gate";
import QueryProvider from "@/providers/query-provider";
import SocketProvider from "@/providers/socket-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import UserProvider from "@/providers/user-provider";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/twitter.svg",
  },
  title: "Chirper",
  description:
    "A twitter-inspired social media platform I created for learning purposes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className={`antialiased min-h-svh bg-background`}>
        <NextTopLoader />
        <Toaster position="top-right" richColors />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HealthGate>
            <QueryProvider>
              <UserProvider>
                <SocketProvider>
                  <Sidebar>{children}</Sidebar>
                </SocketProvider>
              </UserProvider>
            </QueryProvider>
          </HealthGate>
        </ThemeProvider>
      </body>
    </html>
  );
}
