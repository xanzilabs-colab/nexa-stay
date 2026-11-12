"use client";

import { useState, type FormEvent } from "react";

const topics = ["Booking enquiry", "Property question", "Owners & investors", "Other"];

export function ContactEnquiryForm({ initialTopic }: { initialTopic?: string }) {
  const [whatsappUrl, setWhatsappUrl] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      `Hi NexaStay, my name is ${data.get("name")}.`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone") || "Not provided"}`,
      `Enquiry: ${data.get("topic")}`,
      `Message: ${data.get("message")}`,
    ];
    const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "27730884239").replace(/\D/g, "");
    const url = `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
    setWhatsappUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return <div className="contact-form-wrap">
    <h2>Send us an enquiry</h2>
    <p>Tell us a little about what you need and we&apos;ll point you in the right direction.</p>
    <form className="contact-enquiry-form" onSubmit={submit}>
      <label>Name<input name="name" autoComplete="name" required /></label>
      <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      <label>Phone <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" /></label>
      <label>What can we help with?
        <select name="topic" defaultValue={topics.includes(initialTopic ?? "") ? initialTopic : topics[0]}>
          {topics.map((topic) => <option key={topic}>{topic}</option>)}
        </select>
      </label>
      <label className="contact-message-field">Message<textarea name="message" rows={4} required /></label>
      <button className="button button-teal" type="submit">Continue to WhatsApp</button>
    </form>
    {whatsappUrl && <p className="contact-form-status" role="status">Your message is ready. <a href={whatsappUrl} target="_blank" rel="noreferrer">Open WhatsApp to send it.</a></p>}
  </div>;
}
