import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/nextui-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CollabHub",
  description: "Your one stop solution for all your collaboration needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
