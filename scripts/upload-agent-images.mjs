import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

function environmentValue(name) {
  const match = readFileSync(".env.local", "utf8").match(new RegExp(`^${name}=(.*)$`, "m"));
  return match?.[1]?.trim();
}

const url = environmentValue("NEXT_PUBLIC_SUPABASE_URL");
const key = environmentValue("SUPABASE_SERVICE_ROLE_KEY");
if (!url || !key) throw new Error("Supabase URL and service role key are required.");
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const portraitFiles = readdirSync(join(process.cwd(), "public", "media", "agents")).filter((name) => name.endsWith(".png")).sort();
const agentSlugs = ["sarah-mokoena", "thabo-ndlovu", "zola-williams", "lerato-khumalo", "matthew-naidoo"];

if (portraitFiles.length !== agentSlugs.length) throw new Error("Expected five agent portraits.");
for (const [index, slug] of agentSlugs.entries()) {
  const filename = portraitFiles[index];
  const storagePath = `profiles/${slug}.png`;
  const { error: uploadError } = await supabase.storage.from("agent-images").upload(storagePath, readFileSync(join(process.cwd(), "public", "media", "agents", filename)), { upsert: true, contentType: "image/png", cacheControl: "31536000" });
  if (uploadError) throw new Error(`${filename}: ${uploadError.message}`);
  const { data: publicUrl } = supabase.storage.from("agent-images").getPublicUrl(storagePath);
  const { error: updateError } = await supabase.from("agents").update({ image_path: storagePath, image_url: publicUrl.publicUrl }).eq("slug", slug);
  if (updateError) throw new Error(`${slug}: ${updateError.message}`);
  console.log(`Assigned ${filename} to ${slug}`);
}
await supabase.from("agents").update({ active: false }).eq("slug", "nexastay-bookings");
console.log("Agent portraits uploaded and public service record hidden.");