import type { Metadata } from "next";
import { Boldonse, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import PlausibleProvider from "next-plausible";

const boldonse = Boldonse({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-heading",
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "400", "600", "800"],
  variable: "--font-body",
  display: "swap",
});

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
      <body className={`${boldonse.variable} ${bricolageGrotesque.variable}`}>
        <PlausibleProvider domain="bestreads.tomelliot.net">
          {children}
        </PlausibleProvider>
      </body>
    </html>
  );
}
