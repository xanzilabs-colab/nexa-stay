"use client";

import { FormEvent, useState } from "react";
import { CalendarDays, Check, Copy, LoaderCircle } from "lucide-react";
import { CustomSelect } from "@/components/custom-select";
import { DatePicker } from "@/components/date-picker";

type BookingState = "idle" | "submitting" | "success" | "error";

function addDays(value: string, days: number) {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function BookingForm({ propertyId, propertyName }: { propertyId: string; propertyName: string }) {
  const [state, setState] = useState<BookingState>("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [copied, setCopied] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/bookings", { method: "POST", body: JSON.stringify(Object.fromEntries(form)), headers: { "Content-Type": "application/json" } });
    const result = await response.json();
    if (response.ok) {
      setReference(result.referenceCode);
      setState("success");
    } else {
      setState("error");
      setMessage(result.error ?? "Something went wrong. Please try again.");
    }
  }

  async function copyReference() {
    await navigator.clipboard.writeText(reference);
    setCopied(true);
  }

  if (state === "success") return <div className="confirmation"><p className="eyebrow">ENQUIRY SENT</p><h2>Your request is with the agent.</h2><p>Your enquiry for {propertyName} has been sent to the relevant agent. They will be in touch soon using your preferred contact method.</p><div className="reference-card"><span>Reference number</span><strong>{reference}</strong><button type="button" onClick={copyReference}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? "Copied" : "Copy reference"}</button></div><p className="reference-help">Keep this reference number for any future enquiry follow-up.</p></div>;

  return <form className="booking-form" onSubmit={submit}>
    <input type="hidden" name="propertyId" value={propertyId} />
    <div className="two-col"><label>First name<input name="firstName" required /></label><label>Last name<input name="lastName" required /></label></div>
    <label>Email<input name="email" type="email" autoComplete="email" required /></label>
    <div className="two-col"><label>Phone<input name="phone" type="tel" autoComplete="tel" required /></label><label>WhatsApp number<input name="whatsapp" type="tel" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value.replace(/[^0-9+\s()-]/g, ""))} placeholder="+27 73 088 4239" autoComplete="tel" required /><small className="number-help">Use a South African mobile number, for example +27 73 088 4239.</small></label></div>
    <div className="booking-date-note"><CalendarDays size={17} /> Enquiries are available for stays up to 5 nights.</div>
    <div className="two-col"><DatePicker name="checkIn" label="Check-in" value={checkIn} min={today} onChange={(value) => { setCheckIn(value); setCheckOut(""); }} /><DatePicker name="checkOut" label="Check-out" value={checkOut} min={addDays(checkIn, 1)} max={addDays(checkIn, 5)} disabled={!checkIn} onChange={setCheckOut} /></div>
    <div className="two-col"><label>Guests<input name="guests" type="number" min="1" required /></label><label>Preferred contact<CustomSelect name="contactPreference" defaultValue="whatsapp" ariaLabel="Preferred contact method" options={[{ label: "WhatsApp", value: "whatsapp" }, { label: "Phone", value: "phone" }, { label: "Email", value: "email" }]} /></label></div>
    <label>Message<textarea name="message" rows={4} placeholder="Any special requests?" /></label>
    {state === "error" && <p className="form-error">{message}</p>}
    <button disabled={state === "submitting"} className="button teal">{state === "submitting" && <LoaderCircle className="button-spinner" size={17} />}{state === "submitting" ? "Sending enquiry..." : "Send enquiry"}</button>
  </form>;
}
