import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TelemetryWidget from "@/components/TelemetryWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SATFLOW AI – Satellite Temporal Super Resolution",
  description: "AI-Powered Temporal Frame Interpolation for Satellite Imagery. Enhanced cloud tracking, cyclone monitoring, and atmospheric forecasting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <TelemetryWidget />
      </body>
    </html>
  );
}
