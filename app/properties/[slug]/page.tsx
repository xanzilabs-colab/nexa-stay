import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Check, MapPin, MessageCircle, Users } from "lucide-react";
import { getProperty } from "@/lib/data";
import { BookingForm } from "@/components/booking-form";
import { PropertyGallery } from "@/components/property-gallery";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const property = await getProperty((await params).slug);
  return {
    title: property ? `${property.title} in ${property.suburb}, ${property.city}` : "Property not found",
    description: property?.description,
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const property = await getProperty((await params).slug);
  if (!property) notFound();

  const message = encodeURIComponent(`Hi ${property.agent.name.split(" ")[0]}, I'm interested in ${property.title} in ${property.suburb}, ${property.city}. I'd like to enquire about availability.`);
  const whatsapp = property.agent.whatsapp.replace(/\D/g, "");
  const period = property.price_period === "per_month" ? "/ month" : "/ night";
  const price = property.price_period === "price_on_request"
    ? "Price on request"
    : <>R{property.price_per_night.toLocaleString()} <small>{period}</small></>;
  const mapQuery = encodeURIComponent(`${property.suburb}, ${property.city}, ${property.province}`);

  return <main className="property-page">
    <div className="breadcrumbs"><Link href="/">Home</Link><span>›</span><Link href="/properties">Stays</Link><span>›</span><span>{property.title}</span></div>
    <PropertyGallery images={property.images} />
    <div className="property-layout">
      <article className="property-content">
        <p className="location"><MapPin size={16} />{property.suburb}, {property.city}, {property.province}</p>
        <h1>{property.title}</h1>
        <p className="price large">{price}</p>
        <div className="detail-specs">
          <span><BedDouble />{property.bedrooms} bedrooms</span>
          <span><Bath />{property.bathrooms} bathrooms</span>
          <span><Users />{property.max_guests} guests</span>
        </div>
        <h2>About this property</h2>
        <p className="description">{property.description}</p>
        <h2>At a glance</h2>
        <ul className="property-facts">
          <li><span>Development</span><strong>{property.development_name}</strong></li>
          <li><span>Property type</span><strong>{property.property_type}</strong></li>
          <li><span>Bedrooms</span><strong>{property.bedrooms}</strong></li>
          <li><span>Bathrooms</span><strong>{property.bathrooms}</strong></li>
          <li><span>Guests</span><strong>Up to {property.max_guests}</strong></li>
          <li><span>Minimum stay</span><strong>{property.minimum_nights} nights</strong></li>
        </ul>
        <h2>Amenities</h2>
        <div className="amenities">{property.amenities.map((item) => <span key={item}><Check size={16} />{item}</span>)}</div>
        <h2>Location</h2>
        <div className="property-map"><iframe title={`Map of ${property.suburb}, ${property.city}`} src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
        <div className="host">
          {property.agent.image_url
            ? <Image src={property.agent.image_url} alt={property.agent.name} width={76} height={76} />
            : <div className="agent-avatar">{property.agent.name.split(" ").map((name) => name[0]).join("")}</div>}
          <div><p className="eyebrow">YOUR LOCAL AGENT</p><h3>{property.agent.name}</h3><p>{property.agent.position}</p><Link href={`/agents/${property.agent.slug}`}>Meet {property.agent.name.split(" ")[0]}</Link></div>
        </div>
      </article>
      <aside className="booking-card">
        <p className="eyebrow">INTERESTED IN STAYING?</p><h2>Make an enquiry</h2>
        <p>Share your dates with us and the local agent will be in touch.</p>
        <BookingForm propertyId={property.id} propertyName={property.title} />
        <a className="button whatsapp" href={`https://wa.me/${whatsapp}?text=${message}`} target="_blank" rel="noreferrer"><MessageCircle size={17} />WhatsApp agent</a>
        <small>Minimum {property.minimum_nights} nights</small>
      </aside>
    </div>
    <div className="mobile-actionbar">
      <div><strong>{price}</strong><span>Minimum {property.minimum_nights} nights</span></div>
      <a className="mobile-wa" href={`https://wa.me/${whatsapp}?text=${message}`} target="_blank" rel="noreferrer" aria-label="WhatsApp agent"><MessageCircle size={20} /></a>
      <Link href={`/booking/${property.id}`} className="button button-teal">Enquire</Link>
    </div>
  </main>;
}