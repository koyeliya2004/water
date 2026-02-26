import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RTRWH Assessment - Rainwater Harvesting Feasibility Tool",
  description: "Assess the feasibility of rooftop rainwater harvesting for your property. Get customized structure recommendations, cost estimates, and water savings calculations.",
  keywords: ["rainwater harvesting", "RTRWH", "water conservation", "sustainability", "India"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
