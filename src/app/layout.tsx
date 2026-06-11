import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Orqestra OS — The execution layer for AI workflows",
  description:
    "Connect AI models, APIs, and logic into production-grade workflows. Visual builder. Full execution trace. No boilerplate.",
  icons: {
    icon: "/orqestra-favicon.svg",
  },
  openGraph: {
    title: "Orqestra OS",
    description: "The execution layer for AI workflows.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}
    >
      <head />
      <body>
        <ThemeProvider>
          {children}
          <SpeedInsights />
          {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
            <Script
              defer
              data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
              src={process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT || "https://plausible.io/js/script.js"}
              strategy="afterInteractive"
            />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
