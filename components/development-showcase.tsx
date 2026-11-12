import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { developments } from "@/lib/developments";
import { siteAsset } from "@/lib/site-assets";
import type { Property } from "@/types/property";

export function DevelopmentShowcase({ properties }: { properties: Property[] }) {
  return <div className="development-grid">
    {developments.map((development) => {
      const listings = properties.filter((property) => property.development_slug === development.slug);
      const nightlyRates = listings
        .filter((property) => property.price_period !== "per_month" && property.price_period !== "price_on_request" && property.price_per_night > 0)
        .map((property) => property.price_per_night);
      const startingPrice = nightlyRates.length ? Math.min(...nightlyRates) : null;
      return <Link className="development-tile" href={`/properties?development=${development.slug}`} key={development.slug}>
        <Image src={siteAsset(development.fallbackImage)} alt={`${development.name} development`} fill sizes="(max-width: 700px) 82vw, (max-width: 1100px) 48vw, 390px" />
        <div className="development-tile-copy">
          <span><MapPin size={14} />{development.location}</span>
          <h3>{development.name}</h3>
          <p>{development.description}</p>
          <div><span>{listings.length} {listings.length === 1 ? "offering" : "offerings"}{startingPrice !== null ? ` · from R${startingPrice.toLocaleString()}` : ""}</span><ArrowRight /></div>
        </div>
      </Link>;
    })}
  </div>;
}
