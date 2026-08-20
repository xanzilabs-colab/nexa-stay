import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validations";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyNewBooking } from "@/lib/zernio";

function createReferenceCode() {
  return `NXS-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const parsed = bookingSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid enquiry." }, { status: 400 });

    const supabase = createAdminClient();
    if (!supabase) return NextResponse.json({ error: "Enquiries are unavailable until Supabase is configured." }, { status: 503 });

    const { propertyId, ...booking } = parsed.data;
    const { data: property } = await supabase.from("properties").select("id,title,agent_id,max_guests,status").eq("id", propertyId).eq("status", "published").single();
    if (!property) return NextResponse.json({ error: "This property is no longer available." }, { status: 404 });
    if (booking.guests > property.max_guests) return NextResponse.json({ error: "Guest count exceeds this property capacity." }, { status: 400 });

    const referenceCode = createReferenceCode();
    const { error } = await supabase.from("bookings").insert({
      reference_code: referenceCode,
      property_id: property.id,
      agent_id: property.agent_id,
      first_name: booking.firstName,
      last_name: booking.lastName,
      email: booking.email,
      phone: booking.phone,
      whatsapp: booking.whatsapp,
      check_in: booking.checkIn.toISOString().slice(0, 10),
      check_out: booking.checkOut.toISOString().slice(0, 10),
      guests: booking.guests,
      message: booking.message || null,
      contact_preference: booking.contactPreference,
    });
    if (error) throw error;

    try { await notifyNewBooking({ referenceCode, propertyTitle: property.title, guestName: `${booking.firstName} ${booking.lastName}`, guestPhone: booking.whatsapp, checkIn: booking.checkIn.toISOString().slice(0, 10), checkOut: booking.checkOut.toISOString().slice(0, 10) }); } catch (notificationError) { console.error("Zernio booking notification failed", notificationError); }
    return NextResponse.json({ ok: true, referenceCode }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to send your enquiry. Please try again." }, { status: 500 });
  }
}
