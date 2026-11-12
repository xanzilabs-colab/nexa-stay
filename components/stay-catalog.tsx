"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { getSavedStayIds, SAVED_STAYS_CHANGE_EVENT } from "@/lib/saved-stays";
import type { Property } from "@/types/property";

const developments = [
  { slug: "all", name: "All stays" },
  { slug: "ellipse", name: "Ellipse" },
  { slug: "munyaka", name: "Munyaka" },
  { slug: "the-blyde", name: "The Blyde" },
];

type Filters = { city?: string; development?: string; guests?: string; bedrooms?: string; maxPrice?: string; saved?: string; checkIn?: string; checkOut?: string };

export function StayCatalog({ properties, initialFilters }: { properties: Property[]; initialFilters: Filters }) {
  const [query, setQuery] = useState(initialFilters.city ?? "");
  const [development, setDevelopment] = useState(initialFilters.development ?? "all");
  const [guests, setGuests] = useState(initialFilters.guests ?? "");
  const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms ?? "");
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice ?? "");
  const [sort, setSort] = useState("recommended");
  const [savedOnly, setSavedOnly] = useState(initialFilters.saved === "1");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const updateSavedIds = () => setSavedIds(getSavedStayIds());
    updateSavedIds();
    window.addEventListener("storage", updateSavedIds);
    window.addEventListener(SAVED_STAYS_CHANGE_EVENT, updateSavedIds);
    return () => {
      window.removeEventListener("storage", updateSavedIds);
      window.removeEventListener(SAVED_STAYS_CHANGE_EVENT, updateSavedIds);
    };
  }, []);

  const dateSummary = initialFilters.checkIn
    ? ` · ${initialFilters.checkIn}${initialFilters.checkOut ? ` – ${initialFilters.checkOut}` : ""}`
    : "";

  const visible = useMemo(() => {
    const matching = properties.filter((property) => {
      const searchText = `${property.title} ${property.development_name} ${property.city} ${property.suburb}`.toLowerCase();
      return (!query || searchText.includes(query.toLowerCase()))
        && (development === "all" || property.development_slug === development)
        && (!guests || property.max_guests >= Number(guests))
        && (!bedrooms || property.bedrooms >= Number(bedrooms))
        && (!maxPrice || property.price_per_night <= Number(maxPrice))
        && (!savedOnly || savedIds.includes(property.id));
    });
    if (sort === "price-asc") matching.sort((a, b) => a.price_per_night - b.price_per_night);
    if (sort === "price-desc") matching.sort((a, b) => b.price_per_night - a.price_per_night);
    return matching;
  }, [properties, query, development, guests, bedrooms, maxPrice, sort, savedOnly, savedIds]);

  return <div className="catalog">
    <div className="catalog-toolbar">
      <label className="catalog-search"><Search size={18} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stays" aria-label="Search stays" /></label>
      <div className="catalog-filters">
        <label><span className="sr-only">Bedrooms</span><select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}><option value="">Any bedrooms</option><option value="1">1+ bedrooms</option><option value="2">2+ bedrooms</option><option value="3">3 bedrooms</option></select></label>
        <label><span className="sr-only">Guests</span><select value={guests} onChange={(event) => setGuests(event.target.value)}><option value="">Any guests</option><option value="2">2+ guests</option><option value="4">4+ guests</option><option value="6">6 guests</option></select></label>
        <label><span className="sr-only">Maximum price</span><select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}><option value="">Any max price</option><option value="1500">Up to R1,500</option><option value="2000">Up to R2,000</option><option value="2500">Up to R2,500</option><option value="3000">Up to R3,000</option></select></label>
        <label className="sort-select"><ArrowUpDown size={16} /><span className="sr-only">Sort stays</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Recommended</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
      </div>
      <button className={`saved-filter${savedOnly ? " active" : ""}`} type="button" onClick={() => setSavedOnly((current) => !current)}><SlidersHorizontal size={16} />Saved stays</button>
    </div>
    <div className="development-chips" aria-label="Filter by development">
      {developments.map((item) => <button type="button" key={item.slug} className={development === item.slug ? "active" : ""} onClick={() => setDevelopment(item.slug)}>{item.name}</button>)}
    </div>
    <div className="catalog-results-heading"><strong>{visible.length} {visible.length === 1 ? "stay" : "stays"}{development !== "all" ? ` at ${developments.find((item) => item.slug === development)?.name}` : " available"}{dateSummary}</strong>{savedOnly && <span>Saved stays</span>}</div>
    {visible.length ? <div className="catalog-grid">{visible.map((property) => <PropertyCard property={property} compactGuestCount key={property.id} />)}</div>
      : <div className="empty-results"><h2>{savedOnly ? "No saved stays yet" : "No stays match those filters"}</h2><p>{savedOnly ? "Tap the heart on any stay to save it here." : "Try widening your search or clearing one of the filters."}</p><button className="button button-outline" type="button" onClick={() => { setQuery(""); setDevelopment("all"); setGuests(""); setBedrooms(""); setMaxPrice(""); setSavedOnly(false); }}>Clear filters</button></div>}
  </div>;
}
