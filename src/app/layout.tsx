import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/toast";
import BannedGuard from "@/components/BannedGuard";
import FocusTimer from "@/components/FocusTimer";

export const metadata: Metadata = {
  title: {
    default: "CyberTalent AI — Recrutement Cybersécurité",
    template: "%s | CyberTalent AI",
  },
  description:
    "CyberTalent AI vérifie les vraies compétences cyber, score les profils avec l'IA et connecte les meilleurs talents aux recruteurs. Propulsé par Google Gemini.",
  keywords: [
    "cybersécurité",
    "recrutement",
    "IA",
    "pentest",
    "OSCP",
    "HackTheBox",
    "emploi cyber",
    "Afrique",
    "talents cyber",
  ],
  authors: [{ name: "Mouhamed Dia" }],
  creator: "CyberTalent AI",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "CyberTalent AI",
    title: "CyberTalent AI — Recrutement Cybersécurité Propulsé par l'IA",
    description:
      "Plateforme de recrutement cybersécurité qui vérifie les vraies compétences avec l'IA Gemini.",
    url: "https://cybertalent-ai.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberTalent AI — Recrutement Cybersécurité",
    description: "Plateforme de recrutement cybersécurité propulsée par l'IA Gemini.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <ToastProvider>
            <BannedGuard>{children}</BannedGuard>
            <FocusTimer />
          </ToastProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
