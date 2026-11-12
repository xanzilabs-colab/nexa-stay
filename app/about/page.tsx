import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { DevelopmentShowcase } from "@/components/development-showcase";
import { getProperties } from "@/lib/data";
import { siteAsset } from "@/lib/site-assets";

const principles = [
  ["Thoughtful stays", "A considered collection of apartments in the places guests want to be."],
  ["Clear information", "Straightforward property details, local context, and people ready to help."],
  ["Real support", "A simple enquiry process backed by a local team, not an anonymous booking engine."],
];

export default async function AboutPage() {
  const properties = await getProperties();

  return (
    <main className="about-page">
      <section className="about-hero">
        <div>
          <p className="eyebrow">ABOUT NEXASTAY</p>
          <h1>Stay well.<br />Feel at home.</h1>
          <p>NexaStay connects guests with considered short-term stays across Gauteng&apos;s most vibrant residential destinations.</p>
        </div>
        <div className="about-hero-image">
          <Image src={siteAsset("hero/07.jpg")} alt="Contemporary NexaStay residence" fill sizes="(max-width: 800px) 100vw, 50vw" priority />
        </div>
      </section>
      <section className="about-intro">
        <p className="eyebrow">OUR APPROACH</p>
        <div>
          <h2>A better way to find your next stay.</h2>
          <p>We believe accommodation should feel clear from the first search to the final check-in. That means quality homes, honest information, and real people when you need them.</p>
          <p>Whether you&apos;re visiting for work, taking time away, or settling into a new part of the city, NexaStay makes finding the right place feel simple.</p>
        </div>
      </section>
      <section className="about-principles">
        <p className="eyebrow">WHAT MATTERS TO US</p>
        <h2>The details make the stay.</h2>
        <div>
          {principles.map(([title, description]) => (
            <article key={title}>
              <Check size={19} />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="about-developments">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WHERE WE STAY</p>
            <h2>Rooted in Waterfall City.</h2>
          </div>
          <p>Our collection is focused on the developments people return to.</p>
        </div>
        <DevelopmentShowcase properties={properties} />
      </section>
      <section className="about-final">
        <p className="eyebrow light">FIND YOUR PLACE</p>
        <h2>Make your next stay<br />a good one.</h2>
        <Link href="/properties" className="button teal">Explore properties <ArrowRight size={17} /></Link>
      </section>
    </main>
  );
}
