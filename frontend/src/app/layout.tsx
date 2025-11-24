import type { Metadata } from "next";
import "@/styles/globals.css";
import "@mysten/dapp-kit/dist/index.css";
import { Providers } from "./providers";
import NavbarGate from "@/components/navigation/navbar-gate";
import { Toaster } from "@/components/ui/sonner"


export const metadata: Metadata = {
  title: "Auriya – Sell your work, get paid",
  description: "Go from 0 to $1. Anyone can earn their first dollar online. Just start with what you know, see what sticks, and get paid.",
  icons: {
    icon: [
      { url: '/auriya-icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/auriya-icon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/auriya-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NavbarGate />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
