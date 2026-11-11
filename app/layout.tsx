import type { Metadata } from "next";
import type { Viewport } from "next";
import { Libre_Franklin } from "next/font/google";
import "./globals.css";
import "./nexastay-theme.css";
import { Footer, Header } from "@/components/site-chrome";

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "NexaStay | Short-term stays in Waterfall City, Midrand & Pretoria", template: "%s | NexaStay" },
  description: "Book short-term apartment stays across Gauteng with NexaStay — Ellipse, Munyaka and The Blyde — backed by a local team.",
  applicationName: "NexaStay",
  icons: {
    icon: [{ url: "/media/logo-icon.jpg", type: "image/jpeg", sizes: "1024x1024" }],
    apple: [{ url: "/media/logo-icon.jpg", type: "image/jpeg", sizes: "1024x1024" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0B2540",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-ZA"
      className={`${libreFranklin.variable} h-full antialiased`}
    >
      <body className="nexastay-theme"><Header />{children}<Footer /></body>
    </html>
  );
}
