import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import PlausibleProvider from "next-plausible";

export const metadata: Metadata = {
  title: "4-Fineance - Personal Financial Planning",
  description: "A ChatGPT App for personal financial planning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={``}>
        <PlausibleProvider domain="bestreads.tomelliot.net">
          {children}
        </PlausibleProvider>
      </body>
    </html>
  );
}
