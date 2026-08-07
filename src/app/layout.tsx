import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/nav/Sidebar";
import { BottomTabBar } from "@/components/nav/BottomTabBar";
import { FloatingAddButton } from "@/components/nav/FloatingAddButton";
import { MobileHeader } from "@/components/nav/MobileHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BPS Outreach Tracker",
  description: "Tracking kunjungan Business Development BPS",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BPS Outreach",
  },
};

export const viewport: Viewport = {
  themeColor: "#111827",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-gray-50 text-gray-900">
        <Sidebar />
        <MobileHeader />
        <main className="md:pl-60 pb-20 md:pb-0 min-h-screen">{children}</main>
        <BottomTabBar />
        <FloatingAddButton />
      </body>
    </html>
  );
}
