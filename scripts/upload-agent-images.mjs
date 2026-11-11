import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function environmentValue(name) {
  const match = readFileSync(".env.local", "utf8").match(new RegExp(`^${name}=(.*)$`, "m"));
  return match?.[1]?.trim();
}

const url = environmentValue("NEXT_PUBLIC_SUPABASE_URL");
const key = environmentValue("SUPABASE_SERVICE_ROLE_KEY");
if (!url || !key) throw new Error("Supabase URL and service role key are required.");
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const portraitFiles = [
  ["sarah-mokoena", "ac610bcf9e8c48768022f204be8414fe_ach-black-wome-black-wman.png"],
  ["thabo-ndlovu", "afa90a3150c84a198b0e83ce9e59d7d5_ach-black-man.png"],
  ["zola-williams", "d4bbf564a53047c3b7cc309b9830df32_ach-white-man.png"],
  ["lerato-khumalo", "d5b1a5b0a55f4665b8fe6e8edc96bf76_ach-black-man.png"],
  ["matthew-naidoo", "faeb25ffdcd649d487b85eb14d5d4567_ach-white-woman.png"],
];

for (const [slug, filename] of portraitFiles) {
  const storagePath = `profiles/${slug}.png`;
  const { error: uploadError } = await supabase.storage.from("agent-images").upload(storagePath, readFileSync(join(process.cwd(), "public", "media", "agents", filename)), { upsert: true, contentType: "image/png", cacheControl: "31536000" });
  if (uploadError) throw new Error(`${filename}: ${uploadError.message}`);
  const { data: publicUrl } = supabase.storage.from("agent-images").getPublicUrl(storagePath);
  const { error: updateError } = await supabase.from("agents").update({ image_path: storagePath, image_url: publicUrl.publicUrl }).eq("slug", slug);
  if (updateError) throw new Error(`${slug}: ${updateError.message}`);
  console.log(`Assigned ${filename} to ${slug}`);
}
const { error: serviceAgentError } = await supabase.from("agents").update({ active: false }).eq("slug", "nexastay-bookings");
if (serviceAgentError) throw serviceAgentError;
console.log("Agent portraits uploaded and public service record hidden.");