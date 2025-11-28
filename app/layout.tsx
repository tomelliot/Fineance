import type { Metadata } from "next";
import localFont from "next/font/local";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import PlausibleProvider from "next-plausible";

const boldonse = localFont({
  src: "../public/fonts/boldonse/Boldonse-Regular.ttf",
  variable: "--font-heading",
  display: "swap",
  weight: "400",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "400", "600", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fineance - Plan your finances with ChatGPT",
  description: "Plan your finances with ChatGPT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${boldonse.variable} ${bricolageGrotesque.variable} bg-background`}
      >
        <PlausibleProvider domain="fineance.tomelliot.net">
          {children}
        </PlausibleProvider>
      </body>
    </html>
  );
}
