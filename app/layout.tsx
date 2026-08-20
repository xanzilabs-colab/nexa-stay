import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Footer, Header } from "@/components/site-chrome";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "NexaStay | Short-term stays across South Africa", template: "%s | NexaStay" },
  description: "Discover thoughtfully selected short-term rentals across South Africa.",
  icons: { icon: "/media/logo-icon.jpg", apple: "/media/logo-icon.jpg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body><Header />{children}<Footer /></body>
    </html>
  );
}
