import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google"; // Using Outfit for headings (Premium feel)
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
    title: "Stylernow",
    description: "Reserva tu estilo. Barberías premium.",
    manifest: "/manifest.json",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevent zoom on mobile inputs
}

import { Toaster } from "sonner";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className={`${outfit.variable} ${inter.variable}`}>
            <body className="font-sans antialiased text-secondary-foreground bg-app-bg">
                {children}
                <Toaster position="top-center" richColors />
            </body>
        </html>
    );
}
