import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Building2, Check, ChevronDown, MapPin,
  MessageCircle, Search, ShieldCheck, Users,
} from "lucide-react";
import { getAgents, getProperties } from "@/lib/data";
import { siteAsset } from "@/lib/site-assets";
import { HeroMedia } from "@/components/hero-media";
import { HeroSearch } from "@/components/hero-search";
import { PropertyCard } from "@/components/property-card";
import type { Property } from "@/types/property";

const developments = [
  { slug: "ellipse", name: "Ellipse", location: "Waterfall City, Midrand", description: "Refined city apartments with an easy, connected address.", fallbackImage: "hero/Ellipse-ns-slider-1-1024x576.jpeg" },
  { slug: "munyaka", name: "Munyaka", location: "Jukskei View, Midrand", description: "Modern lagoon-living apartments made for unhurried stays.", fallbackImage: "hero/04.jpg" },
  { slug: "the-blyde", name: "The Blyde", location: "Pretoria, Gauteng", description: "Resort-inspired surroundings with space to settle in.", fallbackImage: "hero/jpegorpng.jpeg" },
];

const moments = [
  { path: "ssstik.io_1787129766769.jpg", className: "moment-feature", alt: "A NexaStay apartment interior" },
  { path: "ssstik.io_1787129770476.jpg", className: "moment-top-middle", alt: "A bright apartment living space" },
  { path: "ssstik.io_1787129773983.jpg", className: "moment-top-right", alt: "A considered detail from a NexaStay stay" },
  { path: "ssstik.io_1787129777366.jpg", className: "moment-middle-left", alt: "A welcoming apartment space" },
  { path: "ssstik.io_1787129780726.jpg", className: "moment-quote", alt: "A NexaStay residence" },
  { path: "ssstik.io_1787129784653.jpg", className: "moment-bottom-middle", alt: "Comfortable spaces for your stay" },
  { path: "ssstik.io_1787129788033.jpg", className: "moment-bottom-right", alt: "Thoughtful accommodation in Gauteng" },
];

const reasons = [
  { title: "Verified stays", description: "Every home is clearly presented, so you know what to expect.", icon: ShieldCheck },
  { title: "Local people", description: "Get help from a real local agent when it matters.", icon: Users },
  { title: "Simple enquiries", description: "Find a stay and make a request in just a few minutes.", icon: MessageCircle },
  { title: "South Africa focused", description: "A collection shaped around the places people love here.", icon: MapPin },
];

const questions = [
  ["How do I book a stay?", "Choose a unit, then send an enquiry with your dates and number of guests. A member of the NexaStay team will confirm availability and next steps with you directly."],
  ["Where are your properties?", "NexaStay stays are in Waterfall City and Jukskei View in Midrand, and in Pretoria at The Blyde."],
  ["What sizes of apartment are available?", "Our collection includes one, two, and three-bedroom apartments, sleeping from two to six guests depending on the unit."],
  ["Can I speak to someone before I enquire?", "Yes. Call +27 73 088 4239, message us on WhatsApp, or meet the local team on the Agents page."],
  ["Can I stay longer than a weekend?", "Many of our apartments suit work trips and longer stays. Tell us your dates and the team will advise on availability."],
  ["I own property. Can NexaStay help?", "Yes. Use the owners and investors enquiry and the team will be in touch to discuss your property."],
];

function priceLabel(property: Property) {
  if (property.price_period === "price_on_request") return "Price on request";
  return `R${property.price_per_night.toLocaleString()}${property.price_period === "per_month" ? " / month" : " / night"}`;
}

function developmentImage(properties: Property[], slug: string, fallbackImage: string) {
  return properties.find((property) => property.development_slug === slug)?.images.find((image) => image.is_primary)?.public_url
    ?? siteAsset(fallbackImage);
}

function developmentStartingPrice(properties: Property[], slug: string) {
  const prices = properties.filter((property) => property.development_slug === slug).map((property) => property.price_per_night);
  return prices.length ? Math.min(...prices) : 0;
}

export default async function Home() {
  const [properties, agents] = await Promise.all([getProperties(), getAgents()]);
  const featured = properties.filter((property) => property.featured);
  const featuredStays = (featured.length ? featured : properties).slice(0, 6);
  const priceRows = developments.map((development) => ({
    development,
    properties: properties.filter((property) => property.development_slug === development.slug).slice(0, 3),
  }));
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "NexaStay",
    email: "hello@nexastay.co.za",
    telephone: "+27730884239",
    areaServed: "Gauteng, South Africa",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Waterfall City, Midrand",
      addressRegion: "Gauteng",
      addressCountry: "ZA",
    },
  };

  return <main className="home-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
    <section className="hero-section">
      <div className="hero-background"><HeroMedia /></div>
      <div className="hero-overlay" />
      <div className="site-container hero-content">
        <p className="eyebrow eyebrow-light">SHORT-TERM STAYS, GAUTENG</p>
        <h1>Find your place to stay in Gauteng.</h1>
        <p className="hero-subtitle">Apartments in Waterfall City, Midrand and Pretoria, with a local team behind every stay.</p>
        <HeroSearch />
      </div>
    </section>

    <section className="site-container service-section">
      <div className="service-cards">
        <Link href="/properties">
          <span className="service-icon"><Search /></span>
          <div><h2>Find a stay</h2><p>Browse {properties.length} apartment offerings across three developments.</p><span className="text-link">Search stays <ArrowRight /></span></div>
        </Link>
        <Link href="/agents">
          <span className="service-icon"><Users /></span>
          <div><h2>Speak to a local agent</h2><p>Real people who know the places and can help you choose.</p><span className="text-link">Meet the team <ArrowRight /></span></div>
        </Link>
        <Link href="/contact?topic=owners">
          <span className="service-icon"><Building2 /></span>
          <div><h2>Owners &amp; investors</h2><p>Have property in Gauteng? Talk to us about short-term stays.</p><span className="text-link">Make an enquiry <ArrowRight /></span></div>
        </Link>
      </div>
      <div className="numbers-strip">
        <span><b>{developments.length}</b>developments</span>
        <span><b>{properties.length}</b>stay offerings</span>
        <span><b>{agents.length}</b>local advisors</span>
        <span><b>Gauteng</b>based team</span>
      </div>
    </section>

    <section className="design-section">
      <div className="site-container">
        <div className="section-heading-design">
          <div><span className="eyebrow">A GOOD PLACE TO START</span><h2>Featured stays</h2><p>Hand-picked apartments across our developments.</p></div>
          <Link className="text-link" href="/properties">View all {properties.length} stays <ArrowRight /></Link>
        </div>
        {featuredStays.length ? <div className="featured-grid">{featuredStays.map((property) => <PropertyCard property={property} key={property.id} />)}</div>
          : <p className="no-home-stays">New stays are on their way. Contact our local team to find out what’s available.</p>}
      </div>
    </section>

    <section className="design-section section-soft">
      <div className="site-container">
        <div className="section-heading-design">
          <div><span className="eyebrow">WHERE WE STAY</span><h2>Stay in Waterfall City &amp; Pretoria</h2><p>Our collection is focused on the developments people return to.</p></div>
          <Link className="text-link" href="/properties">Explore all developments <ArrowRight /></Link>
        </div>
        <div className="development-grid">
          {developments.map((development) => {
            const count = properties.filter((property) => property.development_slug === development.slug).length;
            const startingPrice = developmentStartingPrice(properties, development.slug);
            return <Link className="development-tile" href={`/properties?development=${development.slug}`} key={development.slug}>
              <Image src={developmentImage(properties, development.slug, development.fallbackImage)} alt={`${development.name} accommodation`} fill sizes="(max-width: 700px) 82vw, (max-width: 1100px) 48vw, 390px" />
              <div className="development-tile-copy">
                <span><MapPin size={14} />{development.location}</span>
                <h3>{development.name}</h3>
                <p>{development.description}</p>
                <div><span>{count} {count === 1 ? "offering" : "offerings"}{startingPrice ? ` · from R${startingPrice.toLocaleString()}` : ""}</span><ArrowRight /></div>
              </div>
            </Link>;
          })}
        </div>
      </div>
    </section>

    <section className="design-section rate-section">
      <div className="site-container">
        <div className="section-heading-design">
          <div><span className="eyebrow">CLEAR PRICING</span><h2>Rates at a glance</h2><p>Nightly rates from a selection of NexaStay stays.</p></div>
          <Link className="text-link" href="/properties">Browse all stays <ArrowRight /></Link>
        </div>
        <div className="rates-table-wrap"><table className="rates-table">
          <thead><tr><th>Stay</th><th>Beds</th><th>Baths</th><th>Sleeps</th><th>Rate</th><th /></tr></thead>
          <tbody>{priceRows.map(({ development, properties: rows }) => <FragmentRows key={development.slug} name={development.name} location={development.location} properties={rows} />)}</tbody>
        </table></div>
      </div>
    </section>

    <section className="design-section moments-section">
      <div className="site-container">
        <div className="section-heading-design">
          <div><span className="moment-kicker">NEXASTAY MOMENTS</span><h2>A glimpse of the good life.</h2><p>Thoughtful stays. Lasting memories.</p></div>
        </div>
        <div className="moments-grid">
          {moments.map((moment, index) => <figure className={moment.className} key={moment.path}>
            <Image
              src={siteAsset(moment.path)}
              alt={moment.alt}
              fill
              sizes={moment.className === "moment-feature" ? "(max-width: 700px) 76vw, 42vw" : moment.className === "moment-quote" ? "(max-width: 700px) 58vw, 34vw" : "(max-width: 700px) 66vw, 30vw"}
            />
            {index === 4 && <figcaption>Stay a little<br /><em>longer.</em></figcaption>}
          </figure>)}
        </div>
      </div>
    </section>

    <section className="design-section section-soft why-section">
      <div className="site-container">
        <div className="section-heading-design"><div><span className="eyebrow">THE NEXASTAY DIFFERENCE</span><h2>Why book with NexaStay</h2></div></div>
        <div className="why-grid">{reasons.map(({ title, description, icon: Icon }) => <article key={title}>
          <span className="why-icon"><Icon /></span><h3>{title}</h3><p>{description}</p>
        </article>)}</div>
      </div>
    </section>

    <section className="design-section agents-section">
      <div className="site-container">
        <div className="section-heading-design">
          <div><span className="eyebrow">HERE TO HELP</span><h2>Meet your local experts</h2><p>Our team knows these places and is ready to help you find the right fit.</p></div>
          <Link className="text-link" href="/agents">Meet all agents <ArrowRight /></Link>
        </div>
        <div className="agent-design-grid">{agents.slice(0, 5).map((agent, index) => <Link className="agent-design-card" href={`/agents/${agent.slug}`} key={agent.id}>
          <div className={`agent-design-image agent-tone-${index % 5}`}>
            {agent.image_url ? <Image src={agent.image_url} alt={agent.name} fill sizes="(max-width: 700px) 56vw, 220px" /> : <span>{agent.name.split(" ").map((part: string) => part[0]).join("").slice(0, 3)}</span>}
          </div>
          <div><span className="agent-position">{agent.position}</span><h3>{agent.name}</h3><p>{agent.bio}</p><span className="text-link">View profile <ArrowRight /></span></div>
        </Link>)}</div>
      </div>
    </section>

    <section className="design-section section-soft faq-section">
      <div className="site-container faq-layout">
        <div><span className="eyebrow">HERE TO HELP</span><h2>Frequently asked questions</h2><p>Still unsure? Our local team is just a message away.</p><a className="button button-outline" href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "27730884239").replace(/\D/g, "")}`} target="_blank" rel="noreferrer"><MessageCircle size={17} />Ask on WhatsApp</a></div>
        <div className="faq-list">{questions.map(([question, answer]) => <details key={question}>
          <summary>{question}<ChevronDown size={18} /></summary>
          <div className="faq-answer"><div><p>{answer}</p></div></div>
        </details>)}</div>
      </div>
    </section>

    <section className="design-section owner-section-wrap">
      <div className="site-container">
        <div className="owner-panel">
          <div className="owner-panel-copy"><span className="eyebrow eyebrow-light">OWN PROPERTY IN GAUTENG?</span><h2>Talk to NexaStay.</h2><p>Speak to the team about how short-term stays are presented, enquired on, and looked after.</p>
            <ul><li><Check />Professional, clearly presented listings</li><li><Check />A local team handling guest enquiries</li><li><Check />A focus on the developments guests return to</li></ul>
            <Link className="button button-teal" href="/contact?topic=owners">Owners &amp; investors enquiry <ArrowRight /></Link>
          </div>
          <div className="owner-panel-image"><Image src={siteAsset("hero/Ellipse-ns-slider-1-1024x576.jpeg")} alt="Ellipse residences in Waterfall City" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
        </div>
      </div>
    </section>
  </main>;
}

function FragmentRows({ name, location, properties }: { name: string; location: string; properties: Property[] }) {
  return <>
    <tr className="rate-development"><td colSpan={6}>{name} · {location}</td></tr>
    {properties.map((property) => <tr key={property.id}>
      <td><Link href={`/properties/${property.slug}`}>{property.title}</Link><span className="mobile-rate-specs">{property.bedrooms} bed · {property.bathrooms} bath · sleeps {property.max_guests}</span></td>
      <td>{property.bedrooms}</td><td>{property.bathrooms}</td><td>{property.max_guests}</td>
      <td className="rate-price">{priceLabel(property)}</td><td><Link className="text-link" href={`/properties/${property.slug}`}>View <ArrowRight /></Link></td>
    </tr>)}
  </>;
}
