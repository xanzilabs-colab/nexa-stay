import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BookingMessageComposer } from "@/components/booking-message-composer";
import { BookingStatusControl } from "@/components/booking-status-control";
import { isAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

type Detail = {
  reference_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  check_in: string;
  check_out: string;
  guests: number;
  message: string | null;
  contact_preference: string;
  status: string;
  created_at: string;
  property: {
    title: string;
    suburb: string;
    city: string;
    address: string;
    price_per_night: number;
    images: { public_url: string; alt_text: string }[];
  } | null;
  agent: { name: string; email: string } | null;
};

export default async function BookingDetail({ params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminSession()) redirect("/admin/login");

  const supabase = createAdminClient();
  if (!supabase) notFound();

  const bookingId = (await params).id;
  const { data } = await supabase
    .from("bookings")
    .select("*,property:properties(title,suburb,city,address,price_per_night,images:property_images(public_url,alt_text)),agent:agents(name,email)")
    .eq("id", bookingId)
    .single();
  const booking = data as Detail | null;
  if (!booking) notFound();

  return (
    <main className="admin booking-detail admin-detail-page">
      <Link href="/admin" className="admin-back-link">← All enquiries</Link>
      <div className="detail-heading">
        <div>
          <p className="eyebrow">{booking.reference_code}</p>
          <h1>{booking.first_name} {booking.last_name}</h1>
          <p>Received {new Date(booking.created_at).toLocaleDateString("en-ZA", { dateStyle: "long" })}</p>
        </div>
        <b className={`status ${booking.status}`}>{booking.status}</b>
      </div>
      <div className="detail-grid">
        <section>
          <p className="eyebrow">GUEST DETAILS</p>
          <h2>Contact information</h2>
          <dl>
            <dt>Email</dt><dd><a href={`mailto:${booking.email}`}>{booking.email}</a></dd>
            <dt>Phone</dt><dd><a href={`tel:${booking.phone}`}>{booking.phone}</a></dd>
            <dt>WhatsApp</dt><dd><a href={`https://wa.me/${booking.whatsapp}`} target="_blank" rel="noreferrer">{booking.whatsapp}</a></dd>
            <dt>Preferred contact</dt><dd>{booking.contact_preference}</dd>
          </dl>
          <p className="eyebrow">STAY DETAILS</p>
          <h2>Requested dates</h2>
          <dl>
            <dt>Check-in</dt><dd>{booking.check_in}</dd>
            <dt>Check-out</dt><dd>{booking.check_out}</dd>
            <dt>Guests</dt><dd>{booking.guests}</dd>
            <dt>Message</dt><dd>{booking.message ?? "No special requests."}</dd>
          </dl>
          <BookingMessageComposer bookingId={bookingId} guestName={booking.first_name} />
        </section>
        <aside>
          <p className="eyebrow">PROPERTY</p>
          <h2>{booking.property?.title ?? "Property unavailable"}</h2>
          <p>{booking.property?.suburb}, {booking.property?.city}</p>
          {booking.property && (
            <p className="admin-price">R{booking.property.price_per_night.toLocaleString()} <small>/ night</small></p>
          )}
          <p>{booking.property?.address}</p>
          <div className="admin-images">
            {booking.property?.images?.slice(0, 3).map((image, index) => (
              <Image key={index} src={image.public_url} alt={image.alt_text} width={220} height={160} />
            ))}
          </div>
          <hr />
          <p className="eyebrow">ASSIGNED AGENT</p>
          <h3>{booking.agent?.name ?? "No agent assigned"}</h3>
          {booking.agent?.email && <a className="admin-agent-email" href={`mailto:${booking.agent.email}`}>{booking.agent.email}</a>}
          <BookingStatusControl bookingId={bookingId} status={booking.status} />
        </aside>
      </div>
    </main>
  );
}