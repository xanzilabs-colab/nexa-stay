import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAgents, getProperties } from "@/lib/data";

type BookingRow = {
  id: string;
  reference_code: string;
  first_name: string;
  last_name: string;
  check_in: string;
  check_out: string;
  status: string;
  property: { title: string; suburb: string; city: string } | null;
};

export default async function AdminPage() {
  if (!await isAdminSession()) redirect("/admin/login");

  const supabase = createAdminClient();
  const [{ data: bookings }, properties, agents] = await Promise.all([
    supabase
      ? supabase.from("bookings")
        .select("id,reference_code,first_name,last_name,check_in,check_out,status,property:properties(title,suburb,city)")
        .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as BookingRow[] }),
    getProperties(),
    getAgents(),
  ]);
  const requests = (bookings ?? []) as BookingRow[];
  const stats = [
    { label: "Properties", value: properties.length },
    { label: "Published", value: properties.filter((property) => property.available).length },
    { label: "Active agents", value: agents.length },
    { label: "New enquiries", value: requests.filter((item) => item.status === "new").length },
  ];

  return (
    <main className="admin admin-dashboard">
      <div className="admin-head">
        <div>
          <p className="eyebrow">ADMIN OVERVIEW</p>
          <h1>Enquiries &amp; stays</h1>
        </div>
      </div>
      <div className="stat-grid">
        {stats.map(({ label, value }) => (
          <article key={label}>
            <p>{label}</p>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <section className="admin-bookings">
        <div className="section-heading">
          <div>
            <p className="eyebrow">BOOKING REQUESTS</p>
            <h2>Latest enquiries</h2>
          </div>
          <p>{requests.length} total</p>
        </div>
        {requests.length ? (
          <div className="booking-table">
            <div className="booking-table-head">
              <span>Guest</span><span>Property</span><span>Dates</span><span>Status</span><span />
            </div>
            {requests.map((booking) => (
              <div className="booking-table-row" key={booking.id}>
                <span data-label="Guest">
                  <strong>{booking.first_name} {booking.last_name}</strong>
                  <small>{booking.reference_code}</small>
                </span>
                <span data-label="Property">
                  {booking.property?.title ?? "Deleted property"}
                  <small>{booking.property?.suburb}, {booking.property?.city}</small>
                </span>
                <span data-label="Stay dates">
                  {booking.check_in} <small>to</small> {booking.check_out}
                </span>
                <span data-label="Status">
                  <b className={`status ${booking.status}`}>{booking.status}</b>
                </span>
                <Link href={`/admin/bookings/${booking.id}`}>View enquiry</Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <h2>No enquiries yet</h2>
            <p>New website enquiries will appear here after they are stored in Supabase.</p>
          </div>
        )}
      </section>
    </main>
  );
}
