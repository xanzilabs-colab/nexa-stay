import { createAdminClient } from "@/lib/supabase/admin";

const baseUrl = "https://zernio.com/api/v1";

type WhatsAppSettings = { accountId: string; profileId: string };

function normalizePhone(value: string) { return value.replace(/\D/g, ""); }

async function settings(): Promise<WhatsAppSettings> {
  const supabase = createAdminClient();
  const { data } = supabase ? await supabase.from("site_settings").select("key,value").in("key", ["zernio_whatsapp_account_id", "zernio_profile_id"]) : { data: [] };
  const values = Object.fromEntries((data ?? []).map((item) => [item.key, item.value]));
  return { accountId: values.zernio_whatsapp_account_id ?? process.env.ZERNIO_WHATSAPP_ACCOUNT_ID ?? "", profileId: values.zernio_profile_id ?? process.env.ZERNIO_PROFILE_ID ?? "" };
}

async function zernio(path: string, init: RequestInit) {
  const apiKey = process.env.ZERNIO_API_KEY;
  if (!apiKey) throw new Error("Zernio API key is not configured.");
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { Authorization: `Bearer ${apiKey}`, ...init.headers } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message ?? data.error ?? "Zernio could not send the message.");
  return data;
}

export async function getWhatsAppSettings() { return settings(); }

export async function sendWhatsAppMessage({ to, message, file }: { to: string; message: string; file?: File | null }) {
  const { accountId } = await settings();
  if (!accountId) throw new Error("Set a Zernio WhatsApp account ID in Admin settings first.");
  const created = await zernio("/inbox/conversations", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ accountId, participantId: normalizePhone(to), message, category: "utility" }) });
  const conversationId = created.conversation?.id ?? created.conversationId ?? created.id;
  if (file && conversationId) {
    if (file.size > 25 * 1024 * 1024) throw new Error("Attachments must be 25 MB or smaller.");
    const upload = new FormData();
    upload.append("file", file, file.name);
    upload.append("contentType", file.type || "application/octet-stream");
    const media = await zernio("/media/upload-direct", { method: "POST", body: upload });
    await zernio(`/inbox/conversations/${conversationId}/messages`, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify({ accountId, message: "", attachmentUrl: media.url, attachmentType: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file", attachmentName: file.name }) });
  }
  return created;
}

export async function notifyNewBooking({ referenceCode, propertyTitle, guestName, guestPhone, checkIn, checkOut }: { referenceCode: string; propertyTitle: string; guestName: string; guestPhone: string; checkIn: string; checkOut: string }) {
  const ownerNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!ownerNumber) return;
  await sendWhatsAppMessage({ to: ownerNumber, message: `New NexaStay enquiry ${referenceCode}\n${guestName} (${guestPhone})\n${propertyTitle}\n${checkIn} to ${checkOut}` });
}