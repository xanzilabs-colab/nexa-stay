"use client";

import { ArrowRight, Building2, LoaderCircle, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export function HeroSearch() {
  const router = useRouter();
  const [tab, setTab] = useState<"stay" | "owner">("stay");
  const [searching, setSearching] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearching(true);
    const form = new FormData(event.currentTarget);
    const query = new URLSearchParams();
    for (const [key, value] of form.entries()) {
      if (value && value !== "all" && value !== "0") query.set(key, String(value));
    }
    router.push(`/properties${query.size ? `?${query}` : ""}`);
  }
  return <div className="search-panel">
    <div className="search-tabs" role="tablist" aria-label="Search options">
      <button type="button" role="tab" aria-selected={tab === "stay"} className={tab === "stay" ? "active" : ""} onClick={() => setTab("stay")}>Book a stay</button>
      <button type="button" role="tab" aria-selected={tab === "owner"} className={tab === "owner" ? "active" : ""} onClick={() => setTab("owner")}>Owners &amp; investors</button>
    </div>
    {tab === "stay" ? <>
      <form className="search-bar" onSubmit={submit}>
        <label><span>Where</span><select name="development" defaultValue="all"><option value="all">All developments</option><option value="ellipse">Ellipse · Waterfall City</option><option value="munyaka">Munyaka · Waterfall City</option><option value="the-blyde">The Blyde · Pretoria</option></select></label>
        <label><span>Check-in</span><input name="checkIn" type="date" min={new Date().toISOString().slice(0, 10)} /></label>
        <label><span>Check-out</span><input name="checkOut" type="date" min={new Date().toISOString().slice(0, 10)} /></label>
        <label><span>Guests</span><select name="guests" defaultValue="0"><option value="0">Any guests</option><option value="1">1+ guests</option><option value="2">2+ guests</option><option value="4">4+ guests</option><option value="6">6 guests</option></select></label>
        <button className="button button-teal" disabled={searching}>{searching ? <LoaderCircle className="button-spinner" size={18} /> : <Search size={18} />}{searching ? "Searching..." : "Search"}</button>
      </form>
      <div className="quick-links"><span>Browse:</span><Link href="/properties?development=ellipse">Ellipse</Link><Link href="/properties?development=munyaka">Munyaka</Link><Link href="/properties?development=the-blyde">The Blyde</Link></div>
    </> : <div className="owner-search"><div><h2>List with NexaStay</h2><p>Own or investing in Gauteng property? Tell us about it and the team will be in touch.</p></div><Link className="button button-teal" href="/contact?topic=owners"><Building2 size={17} />Start an enquiry <ArrowRight size={17} /></Link></div>}
  </div>;
}