"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { siteAsset } from "@/lib/site-assets";

const images = [
  siteAsset("hero/07.jpg"),
  siteAsset("hero/04.jpg"),
  siteAsset("hero/jpegorpng (2).jpeg"),
  siteAsset("hero/jpegorpng.jpeg"),
];

export function HeroMedia() {
  const [active, setActive] = useState(0);
  useEffect(() => { const interval = window.setInterval(() => setActive((current) => (current + 1) % images.length), 6000); return () => window.clearInterval(interval); }, []);
  return <div className="hero-media" aria-hidden="true">{images.map((src, index) => <Image key={src} className={index === active ? "active" : ""} src={src} alt="" fill priority={index === 0} sizes="100vw" />)}</div>;
}