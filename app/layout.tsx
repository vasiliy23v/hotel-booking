import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Только для Vercel Preview (ветка develop): никогда не показывается в production
const isPreview = process.env.VERCEL_ENV === "preview";

export const metadata: Metadata = {
  title: isPreview ? "[TEST] Hotel Booking System" : "Hotel Booking System",
  description: "Система управления бронированием отелей",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {isPreview && (
            <div className="fixed top-0 left-0 right-0 z-[100000] bg-fuchsia-600 text-white text-center text-xs font-bold py-1 pointer-events-none">
              🧪 ТЕСТОВАЯ ВЕРСИЯ (develop) — тестовая база, не продакшн
            </div>
          )}
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
