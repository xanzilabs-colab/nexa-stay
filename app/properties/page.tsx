import { getProperties } from "@/lib/data";
import { StayCatalog } from "@/components/stay-catalog";
import Link from "next/link";

export const metadata = { title: "Stays in Waterfall City, Midrand & Pretoria" };

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<{ city?: string; development?: string; guests?: string; bedrooms?: string; maxPrice?: string; saved?: string; checkIn?: string; checkOut?: string }> }) {
  const [params, properties] = await Promise.all([searchParams, getProperties()]);
  const initialFilters = {
    city: params.city,
    development: params.development,
    guests: params.guests,
    bedrooms: params.bedrooms,
    maxPrice: params.maxPrice,
    saved: params.saved,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
  };

  return <main className="stays-page">
    <section className="page-intro"><div className="site-container">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>›</span><span>Stays</span></div>
      <p className="eyebrow">NEXASTAY DEVELOPMENTS</p>
      <h1>Short-term stays in Gauteng</h1>
      <p>Apartments in Waterfall City, Midrand and Pretoria, backed by a local team.</p>
    </div></section>
    <section className="site-container catalog-section"><StayCatalog properties={properties} initialFilters={initialFilters} /></section>
  </main>;
}