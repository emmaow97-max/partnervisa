import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proof of Us",
  description: "A private archive of our life together — and our partner visa evidence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
