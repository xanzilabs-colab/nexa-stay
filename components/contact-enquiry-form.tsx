"use client";

import type { FormEvent, MouseEvent } from "react";
import { MessageCircle } from "lucide-react";

const topics = ["Book a stay", "Ask about a property", "Owners & investors", "Something else"];

function messageFrom(data: FormData) {
  const phone = String(data.get("phone") ?? "").trim();
  return `Hi NexaStay — ${data.get("topic")}.\nName: ${data.get("name")}${phone ? `\nPhone: ${phone}` : ""}\n\n${data.get("message")}`;
}

export function ContactEnquiryForm({ initialTopic }: { initialTopic?: string }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "27730884239").replace(/\D/g, "");
    const url = `https://wa.me/${number}?text=${encodeURIComponent(messageFrom(data))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function sendEmail(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const form = event.currentTarget.closest("form");
    if (!form) return;
    const data = new FormData(form);
    const subject = `Website enquiry: ${data.get("topic")}`;
    const body = messageFrom(data);
    window.location.assign(`mailto:hello@nexastay.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  }

  return <form className="contact-form-wrap" onSubmit={submit}>
    <h2>Send an enquiry</h2>
    <p>We&apos;ll open WhatsApp with your message ready to send.</p>
    <div className="contact-enquiry-form">
      <label className="contact-field-wide">Full name<input name="name" autoComplete="name" placeholder="Your name" required /></label>
      <label>Phone<input name="phone" type="tel" autoComplete="tel" /></label>
      <label>Enquiring about
        <select name="topic" defaultValue={topics.includes(initialTopic ?? "") ? initialTopic : topics[0]}>
          {topics.map((topic) => <option key={topic}>{topic}</option>)}
        </select>
      </label>
      <label className="contact-field-wide">Message<textarea name="message" rows={4} placeholder="Dates, guests, preferred development…" required /></label>
      <button className="button button-whatsapp contact-field-wide" type="submit"><MessageCircle />Send on WhatsApp</button>
      <p className="contact-email-fallback contact-field-wide">or <a href="mailto:hello@nexastay.co.za" onClick={sendEmail}>send by email</a></p>
    </div>
  </form>;
}
