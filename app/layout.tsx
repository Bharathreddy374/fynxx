// app/layout.tsx
import type { Metadata } from "next";
import { Cinzel_Decorative, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // Import the Toaster

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cinzel",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Fynxx",
  description: "The ultimate platform for influencers and brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${playfair.variable} font-body bg-lavender/10 text-slate-800`}>
        {children}
        <Toaster richColors /> {/* Add this line */}
      </body>
    </html>
  );
}