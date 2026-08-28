import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import ClientShell from "@/components/ClientShell";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Skan — منصة سكن الطلاب",
  description:
    "اكتشف واحجز شقتك القريبة من الجامعة بتجربة ثلاثية الأبعاد. صور، فيديو، وأسعار واضحة.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} antialiased`}>
      <body className="min-h-screen overflow-x-hidden">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
