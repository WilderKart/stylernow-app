import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stylernow",
  description: "Your style, now.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-sans bg-[#e5e5e5] flex justify-center min-h-screen antialiased`}
      >
        <div className="w-full max-w-[430px] bg-[#F2F4F7] min-h-screen shadow-2xl relative overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
