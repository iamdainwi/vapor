import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: "VAPOR — Nothing Lasts",
  description:
    "The anti-hoarding reader. No archives, no clutter. Just pure content that dissolves when you're done.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased dark",
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#0e0e10] text-[#f9f5f8]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
