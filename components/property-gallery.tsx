"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { PropertyImage } from "@/types/property";

export function PropertyGallery({ images }: { images: PropertyImage[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const activeIndex = active ?? 0;
  const image = active === null ? null : images[activeIndex];
  const previous = () => setActive((current) => current === null ? null : (current - 1 + images.length) % images.length);
  const next = () => setActive((current) => current === null ? null : (current + 1) % images.length);

  useEffect(() => {
    if (active === null) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", keydown);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", keydown); document.body.style.overflow = ""; };
  }, [active, images.length]);

  if (!images.length) return <div className="gallery gallery-empty">Property images will be added soon.</div>;
  return <><div className="gallery">{images.map((item, index) => <button type="button" className={index === 0 ? "gallery-main" : "gallery-small"} onClick={() => setActive(index)} key={item.id} aria-label={`Open image ${index + 1} of ${images.length}`}><Image src={item.public_url} alt={item.alt_text} fill priority={index === 0} sizes="(max-width: 800px) 100vw, 66vw" /></button>)}</div>{image && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Property image ${activeIndex + 1} of ${images.length}`} onClick={() => setActive(null)}><button type="button" className="lightbox-close" onClick={() => setActive(null)} aria-label="Close gallery"><X /></button><button type="button" className="lightbox-nav previous" onClick={(event) => { event.stopPropagation(); previous(); }} aria-label="Previous image"><ChevronLeft /></button><div className="lightbox-image" onClick={(event) => event.stopPropagation()} onTouchStart={(event) => setTouchStart(event.touches[0].clientX)} onTouchEnd={(event) => { if (touchStart === null) return; const difference = event.changedTouches[0].clientX - touchStart; if (difference > 50) previous(); if (difference < -50) next(); setTouchStart(null); }}><Image src={image.public_url} alt={image.alt_text} fill sizes="100vw" priority/></div><div className="lightbox-thumbnails" onClick={(event) => event.stopPropagation()}>{images.map((item, index) => <button type="button" key={item.id} className={index === activeIndex ? "active" : ""} onClick={() => setActive(index)} aria-label={`View image ${index + 1}`}><Image src={item.public_url} alt="" fill sizes="84px" /></button>)}</div><span className="lightbox-count">{activeIndex + 1} / {images.length}</span><button type="button" className="lightbox-nav next" onClick={(event) => { event.stopPropagation(); next(); }} aria-label="Next image"><ChevronRight /></button></div>}</>;
}