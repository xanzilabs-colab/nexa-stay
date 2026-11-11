"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, Heart, Home, Info, MessageCircle, Phone, Search, UserRound } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { siteAsset } from "@/lib/site-assets";

const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "27730884239").replace(/\D/g, "");
const navigation = [
  { href: "/properties", label: "Stays", icon: Search },
  { href: "/properties?development=all", label: "Developments", icon: Building2 },
  { href: "/agents", label: "Agents", icon: UserRound },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: MessageCircle },
];
const tabNavigation = navigation.filter(({ label }) => label !== "Developments");

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);
  const logoClicks = useRef(0);
  const logoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateSavedCount = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("nx-saved") ?? "[]");
        setSavedCount(Array.isArray(saved) ? saved.length : 0);
      } catch {
        setSavedCount(0);
      }
    };
    updateSavedCount();
    window.addEventListener("storage", updateSavedCount);
    window.addEventListener("saved-stays-change", updateSavedCount);
    return () => {
      window.removeEventListener("storage", updateSavedCount);
      window.removeEventListener("saved-stays-change", updateSavedCount);
    };
  }, []);

  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    logoClicks.current += 1;
    if (logoTimer.current) clearTimeout(logoTimer.current);
    if (logoClicks.current === 3) {
      event.preventDefault();
      logoClicks.current = 0;
      router.push("/admin/login");
      return;
    }
    logoTimer.current = setTimeout(() => {
      logoClicks.current = 0;
    }, 550);
  }

  return <>
    <div className="utility-bar">
      <div className="site-container utility-inner">
        <span>Short-term stays across Gauteng</span>
        <div>
          <a href="tel:+27730884239">Call +27 73 088 4239</a>
          <a href="mailto:hello@nexastay.co.za">hello@nexastay.co.za</a>
          <Link href="/contact?topic=owners">List your property</Link>
        </div>
      </div>
    </div>
    <header className="site-header">
      <div className="site-container header-inner">
        <Link className="brand" href="/" onClick={handleLogoClick} aria-label="NexaStay home">
          <Image src={siteAsset("logo.png")} alt="" width={42} height={42} priority />
          <span>Nexa<b>Stay</b></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary">
          {navigation.map(({ href, label }) => <Link className={pathname.startsWith(href) ? "active" : ""} href={href} key={href}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="saved-link" href="/properties?saved=1" aria-label={`Saved stays, ${savedCount} saved`}>
            <Heart size={18} /><span>Saved</span><em>{savedCount}</em>
          </Link>
          <Link className="button button-teal header-enquire" href="/contact">Enquire now</Link>
          <a className="mobile-call mobile-whatsapp" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" aria-label="WhatsApp NexaStay"><MessageCircle size={19} /></a>
          <a className="mobile-call" href="tel:+27730884239" aria-label="Call NexaStay"><Phone size={19} /></a>
        </div>
      </div>
    </header>
    <nav className="mobile-tabbar" aria-label="Mobile navigation">
      <Link className={pathname === "/" ? "active" : ""} href="/"><Home /><span>Home</span></Link>
      {tabNavigation.map(({ href, label, icon: Icon }) => <Link className={pathname.startsWith(href) ? "active" : ""} href={href} key={href}><Icon /><span>{label}</span></Link>)}
    </nav>
  </>;
}

export function Footer() {
  return <>
    <section className="newsletter">
      <div className="site-container newsletter-inner">
        <div><h2>Need a hand finding a stay?</h2><p>Tell our local team what you’re looking for and we’ll help you choose.</p></div>
        <Link className="button button-navy" href="/contact">Talk to our team</Link>
      </div>
    </section>
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand brand-light" href="/">
              <Image src={siteAsset("logo.png")} alt="" width={42} height={42} />
              <span>Nexa<b>Stay</b></span>
            </Link>
            <p>Thoughtful short-term stays across Gauteng, backed by a local team.</p>
          </div>
          <div><h2>Stays</h2><Link href="/properties?development=ellipse">Ellipse</Link><Link href="/properties?development=munyaka">Munyaka</Link><Link href="/properties?development=the-blyde">The Blyde</Link><Link href="/properties">All properties</Link></div>
          <div><h2>Company</h2><Link href="/about">About NexaStay</Link><Link href="/agents">Our agents</Link><Link href="/contact?topic=owners">Owners &amp; investors</Link><Link href="/contact">Contact</Link></div>
          <div><h2>Contact</h2><a href="tel:+27730884239">+27 73 088 4239</a><a href="mailto:hello@nexastay.co.za">hello@nexastay.co.za</a><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp us</a><span>Waterfall City, Midrand</span></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} NexaStay. All rights reserved.</span><span>Short-term stays across Gauteng</span></div>
      </div>
    </footer>
  </>;
}
