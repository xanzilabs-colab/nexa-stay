"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { CustomSelect } from "@/components/custom-select";

export function HeroSearch() {
  const [searching, setSearching] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearching(true);
    const form = new FormData(event.currentTarget);
    const query = new URLSearchParams();
    for (const [key, value] of form.entries()) if (value) query.set(key, String(value));
    window.location.assign(`/properties${query.size ? `?${query}` : ""}`);
  }
  return <form className="search-bar" onSubmit={submit}><label className="hero-select">Where<input name="city" placeholder="City or suburb" /></label><label className="hero-select">Guests<CustomSelect name="guests" ariaLabel="Guest count" options={[{ label: "Any guests", value: "" }, { label: "2 guests", value: "2" }, { label: "4 guests", value: "4" }, { label: "6+ guests", value: "6" }]} /></label><button disabled={searching}>{searching ? <LoaderCircle className="button-spinner" size={18} /> : <ArrowRight size={18} />}{searching ? "Searching stays..." : "Search stays"}</button></form>;
}