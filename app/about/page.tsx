import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home, Info, UserRound } from "lucide-react";
import { DevelopmentShowcase } from "@/components/development-showcase";
import { getProperties } from "@/lib/data";
import { siteAsset } from "@/lib/site-assets";

const principles = [
  { title: "Thoughtful stays", description: "A considered collection of apartments in the places guests want to be.", icon: Home },
  { title: "Clear information", description: "Straightforward property details, local context, and people ready to help.", icon: Info },
  { title: "Real support", description: "A simple enquiry process backed by a local team, not an anonymous booking engine.", icon: UserRound },
];

export default async function AboutPage() {
  const properties = await getProperties();
  return <main className="reference-page">
    <section className="page-intro"><div className="site-container">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>›</span><span>About</span></div>
      <h1>Stay well. Feel at home.</h1>
      <p>NexaStay connects guests with considered short-term stays across Gauteng&apos;s most vibrant residential destinations.</p>
    </div></section>
    <section className="design-section"><div className="site-container about-split">
      <div>
        <h2>A better way to find your next stay</h2>
        <p>We believe accommodation should feel clear from the first search to the final check-in. That means quality homes, honest information, and real people when you need them.</p>
        <p>Whether you&apos;re visiting for work, taking time away, or settling into a new part of the city, NexaStay makes finding the right place feel simple.</p>
        <Link className="button button-teal" href="/properties">Browse stays <ArrowRight /></Link>
      </div>
      <div className="about-image"><Image src={siteAsset("hero/07.jpg")} alt="A contemporary NexaStay residence" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
    </div></section>
    <section className="design-section section-soft"><div className="site-container">
      <div className="section-heading-design"><div><h2>What matters to us</h2></div></div>
      <div className="about-principles">{principles.map(({ title, description, icon: Icon }) => <article key={title}>
        <span className="why-icon"><Icon /></span><h3>{title}</h3><p>{description}</p>
      </article>)}</div>
    </div></section>
    <section className="design-section"><div className="site-container">
      <div className="section-heading-design"><div><span className="eyebrow">WHERE WE STAY</span><h2>Rooted in Waterfall City.</h2><p>Our collection is focused on the developments people return to.</p></div></div>
      <DevelopmentShowcase properties={properties} />
    </div></section>
  </main>;
}
