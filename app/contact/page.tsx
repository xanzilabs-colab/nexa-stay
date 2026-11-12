import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactEnquiryForm } from "@/components/contact-enquiry-form";

const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "27730884239").replace(/\D/g, "");
const whatsappMessage = encodeURIComponent("Hi NexaStay, I would like help finding a stay.");

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  return <main className="reference-page">
    <section className="page-intro"><div className="site-container">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>›</span><span>Contact</span></div>
      <h1>We&apos;re here to help</h1>
      <p>Questions about a stay, planning a visit, or managing a property? Get in touch with our local team.</p>
    </div></section>
    <section className="contact-design-section"><div className="site-container contact-design-layout">
      <div className="contact-details">
        <h2>Talk to NexaStay</h2>
        <p>We&apos;re a local team who can help you find the right stay or answer questions about your enquiry.</p>
        <a className="contact-detail" href="mailto:hello@nexastay.co.za"><span><Mail /></span><div><small>EMAIL</small><strong>hello@nexastay.co.za</strong><em>Send us your enquiry</em></div></a>
        <a className="contact-detail" href="tel:+27730884239"><span><Phone /></span><div><small>PHONE</small><strong>+27 73 088 4239</strong><em>Speak to our bookings team</em></div></a>
        <a className="contact-detail" href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noreferrer"><span><MessageCircle /></span><div><small>WHATSAPP</small><strong>Message NexaStay</strong><em>Quick answers when you need them</em></div></a>
        <div className="contact-detail"><span><MapPin /></span><div><small>OUR FOCUS</small><strong>Waterfall City, Midrand</strong><em>Short-term stays across Gauteng</em></div></div>
      </div>
      <ContactEnquiryForm initialTopic={topic === "owners" ? "Owners & investors" : topic} />
    </div></section>
  </main>;
}
