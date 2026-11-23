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

// Индикатор окружения (не зависит от настроек Vercel).
// Определяем по хосту базы, к которой подключено приложение: продовая БД Neon известна,
// всё остальное считается тестовой базой. Сам DATABASE_URL никуда не выводится.
const PROD_DB_ENDPOINT = "ep-twilight-rain-ag21bm04";
function getDbHost(): string {
  try {
    return new URL(process.env.DATABASE_URL ?? "").hostname;
  } catch {
    return "";
  }
}
const dbHost = getDbHost();
const isProdDb = dbHost.includes(PROD_DB_ENDPOINT);
const isTestDb = dbHost !== "" && !isProdDb;
// Preview-деплой, подключённый к боевой базе — опасная ситуация
const isPreviewOnProdDb = isProdDb && process.env.VERCEL_ENV === "preview";

export const metadata: Metadata = {
  title: isTestDb ? "[TEST] Hotel Booking System" : "Hotel Booking System",
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
          forcedTheme="light"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {isTestDb && (
            <div className="fixed top-0 left-0 right-0 z-[100000] bg-fuchsia-600 text-white text-center text-xs font-bold py-1 pointer-events-none">
              🧪 ТЕСТОВАЯ ВЕРСИЯ — подключена тестовая база, не продакшн
            </div>
          )}
          {isPreviewOnProdDb && (
            <div className="fixed top-0 left-0 right-0 z-[100000] bg-red-600 text-white text-center text-xs font-bold py-1 pointer-events-none">
              ⚠️ PREVIEW ПОДКЛЮЧЁН К БОЕВОЙ БАЗЕ — не вносите изменения!
            </div>
          )}
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
