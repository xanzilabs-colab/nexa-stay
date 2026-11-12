"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, Heart, Home, Info, MessageCircle, Phone, Search, UserRound } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
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
  function requestStayAlerts(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    if (typeof email !== "string") return;
    const subject = encodeURIComponent("NexaStay stay alerts");
    const body = encodeURIComponent(`Please send me stay availability and offer updates at ${email.trim()}.`);
    window.location.href = `mailto:hello@nexastay.co.za?subject=${subject}&body=${body}`;
  }

  return <>
    <section className="newsletter">
      <div className="site-container newsletter-inner">
        <div><h2>Get stay alerts</h2><p>New availability and offers from NexaStay, straight to your inbox.</p></div>
        <form className="newsletter-form" onSubmit={requestStayAlerts}>
          <label className="sr-only" htmlFor="newsletter-email">Your email address</label>
          <input id="newsletter-email" name="email" type="email" required placeholder="Your email address" />
          <button className="button button-navy" type="submit">Sign up</button>
        </form>
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
            <p>Thoughtful short-term stays across South Africa, backed by a local Gauteng team.</p>
          </div>
          <div><h2>Stays</h2><ul><li><Link href="/properties?development=ellipse">Ellipse</Link></li><li><Link href="/properties?development=munyaka">Munyaka</Link></li><li><Link href="/properties?development=the-blyde">The Blyde</Link></li><li><Link href="/properties">All properties</Link></li></ul></div>
          <div><h2>Company</h2><ul><li><Link href="/about">About NexaStay</Link></li><li><Link href="/agents">Our agents</Link></li><li><Link href="/contact?topic=owners">Owners &amp; investors</Link></li><li><Link href="/contact">Contact</Link></li></ul></div>
          <div><h2>Contact</h2><ul><li><a href="tel:+27730884239">+27 73 088 4239</a></li><li><a href="mailto:hello@nexastay.co.za">hello@nexastay.co.za</a></li><li><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp us</a></li><li><span>Waterfall City, Midrand</span></li></ul></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} NexaStay. All rights reserved.</span><span>Short-term stays across Gauteng</span></div>
      </div>
    </footer>
  </>;
}
