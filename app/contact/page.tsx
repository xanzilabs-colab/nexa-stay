import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactEnquiryForm } from "@/components/contact-enquiry-form";

const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "27730884239").replace(/\D/g, "");
const whatsappMessage = encodeURIComponent("Hi NexaStay");

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  return <main className="reference-page">
    <section className="page-intro"><div className="site-container">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>›</span><span>Contact</span></div>
      <h1>Let&apos;s find the right stay</h1>
      <p>Whether you have a question about a property or need help choosing between stays, the NexaStay team is here to help.</p>
    </div></section>
    <section className="contact-design-section"><div className="site-container contact-design-layout">
      <div className="contact-left">
        <div className="contact-tiles">
          <a className="contact-tile contact-tile-wide" href="mailto:hello@nexastay.co.za"><span><Mail /></span><p><small>Email</small><strong>hello@nexastay.co.za</strong></p></a>
          <a className="contact-tile" href="tel:+27730884239"><span><Phone /></span><p><small>Phone</small><strong>+27 73 088 4239</strong></p></a>
          <a className="contact-tile" href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noreferrer"><span><MessageCircle /></span><p><small>WhatsApp</small><strong>Message us</strong></p></a>
          <div className="contact-tile contact-tile-wide"><span><MapPin /></span><p><small>Our focus</small><strong>Waterfall City, Midrand</strong></p></div>
        </div>
        <div className="contact-map"><iframe loading="lazy" title="Waterfall City, Midrand" src="https://www.google.com/maps?q=Waterfall+City+Midrand&output=embed" /></div>
      </div>
      <ContactEnquiryForm initialTopic={topic === "owners" ? "Owners & investors" : topic} />
    </div></section>
  </main>;
}
