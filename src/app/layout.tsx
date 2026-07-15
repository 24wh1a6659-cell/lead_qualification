import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import { AICopilotButton } from "@/components/dashboard/ai-copilot";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeadPilot AI – Autonomous Lead Intelligence & Sales Copilot",
  description: "Enterprise-grade AI-powered lead scoring, enrichment, and sales automation platform with human-in-the-loop approval.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} animated-gradient min-h-screen`}>
        <Sidebar />
        <main className="ml-64 min-h-screen">
          <div className="container mx-auto max-w-7xl px-8 py-8">
            {children}
          </div>
        </main>
        <AICopilotButton />
      </body>
    </html>
  );
}
