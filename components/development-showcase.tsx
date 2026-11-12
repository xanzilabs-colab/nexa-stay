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
      const startingPrice = listings.length ? Math.min(...listings.map((property) => property.price_per_night)) : 0;
      const primaryImage = listings.find((property) => property.images.some((image) => image.is_primary))
        ?.images.find((image) => image.is_primary)?.public_url;
      return <Link className="development-tile" href={`/properties?development=${development.slug}`} key={development.slug}>
        <Image src={primaryImage || siteAsset(development.fallbackImage)} alt={`${development.name} accommodation`} fill sizes="(max-width: 700px) 82vw, (max-width: 1100px) 48vw, 390px" />
        <div className="development-tile-copy">
          <span><MapPin size={14} />{development.location}</span>
          <h3>{development.name}</h3>
          <p>{development.description}</p>
          <div><span>{listings.length} {listings.length === 1 ? "offering" : "offerings"}{startingPrice ? ` · from R${startingPrice.toLocaleString()}` : ""}</span><ArrowRight /></div>
        </div>
      </Link>;
    })}
  </div>;
}
