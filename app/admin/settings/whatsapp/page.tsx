import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { WhatsAppSettingsForm } from "@/components/whatsapp-settings-form";
export default async function WhatsAppSettingsPage(){if(!await isAdminSession())redirect("/admin/login");const supabase=createAdminClient();const {data}=supabase?await supabase.from("site_settings").select("key,value").in("key",["zernio_whatsapp_account_id","zernio_profile_id"]):{data:[]};const settings=Object.fromEntries((data??[]).map(item=>[item.key,item.value]));return <main className="admin settings-page"><Link href="/admin" className="text-link">← Admin overview</Link><WhatsAppSettingsForm accountId={settings.zernio_whatsapp_account_id??""} profileId={settings.zernio_profile_id??""}/></main>}