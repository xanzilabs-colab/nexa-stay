import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Camera, MapPin, Users } from "lucide-react";
import type { Property } from "@/types/property";
import { SaveStayButton } from "@/components/save-stay-button";

export function PropertyCard({ property }: { property: Property }) {
  const image = property.images.find((item) => item.is_primary) ?? property.images[0];
  const price = property.price_period === "price_on_request"
    ? "Price on request"
    : <>R{property.price_per_night.toLocaleString()} <small>{property.price_period === "per_month" ? "/ month" : "/ night"}</small></>;

  return <article className="stay-card">
    <Link href={`/properties/${property.slug}`} className={`stay-card-image${image ? "" : " image-pending"}`} aria-label={`View ${property.title}`}>
      {image ? <Image src={image.public_url} alt={image.alt_text || property.title} fill sizes="(max-width: 700px) 86vw, (max-width: 1100px) 45vw, 380px" /> : <span>Listing images coming soon</span>}
      {property.featured && <span className="stay-badge">Featured</span>}
      <span className="stay-image-count"><Camera size={14} />{property.images.length || 0}</span>
    </Link>
    <SaveStayButton propertyId={property.id} label={property.title} />
    <div className="stay-card-body">
      <p className="stay-price">{price}</p>
      <h3><Link href={`/properties/${property.slug}`}>{property.title}</Link></h3>
      <p className="stay-location"><MapPin size={15} />{property.development_name}, {property.suburb}, {property.city}</p>
      <ul className="stay-specs">
        <li><BedDouble size={16} />{property.bedrooms} bed</li>
        <li><Bath size={16} />{property.bathrooms} bath</li>
        <li><Users size={16} />{property.max_guests} guests</li>
      </ul>
      <div className="stay-card-actions">
        <Link className="button button-outline" href={`/properties/${property.slug}`}>View stay</Link>
        <Link className="button button-teal" href={`/booking/${property.id}`}>Enquire</Link>
      </div>
    </div>
  </article>;
}
