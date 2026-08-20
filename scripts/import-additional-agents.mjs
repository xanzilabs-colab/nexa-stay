import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function environmentValue(name) { return readFileSync(".env.local", "utf8").match(new RegExp(`^${name}=(.*)$`, "m"))?.[1]?.trim(); }
const url = environmentValue("NEXT_PUBLIC_SUPABASE_URL");
const key = environmentValue("SUPABASE_SERVICE_ROLE_KEY");
if (!url || !key) throw new Error("Supabase URL and service role key are required.");
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const root = join(process.cwd(), "public", "media", "agents");
const agents = [
  ["alize-benadie", "Alize Benadie", "Candidate Property Practitioner", "Bushveld", "398_2bef4ec09ab540a98c8102f85569027e_t_w_304_h_304-white-woman.png"],
  ["alita-rich", "Alita Rich", "Candidate Property Practitioner", "Rustenburg", "398_24a150e3852a4ea6b56fa437cc2b8388_t_w_304_h_304-white-woman.png"],
  ["amohelo-mthembu", "Amohelo Mthembu", "Candidate Property Practitioner", "Fourways", "398_764f557e770c45ccb8cda6e94ca7b248_t_w_304_h_304-black-woman.png"],
  ["alex-conradie", "Alex Conradie", "Principal Property Practitioner", "Rustenburg", "398_927afc3468054836865239f53e5ae90a_t_w_304_h_304-white-man.png"],
  ["alvina-naidu", "Alvina Naidu", "Administrator", "Bryanston", "398_4094df9037ef47b19172ae3d8ad42ff2_t_w_304_h_304-indian-woman.png"],
  ["amanda-velez", "Amanda Velez", "Operations Manager", "Western Seaboard", "398_16961aa6532247a49b66ddd59b2b7bf6_t_w_304_h_304-coloured-woman.png"],
  ["adrian-fourie", "Adrian Fourie", "Candidate Property Practitioner", "Ballito", "398_a376a4031cd04642b78f342915c8e594_t_w_304_h_304-white-man.png"],
  ["aletta-mashishi", "Aletta Mashishi", "Candidate Property Practitioner", "Phalaborwa", "398_dfd6327cb27b4116b5af7485a90cf5f3_t_w_304_h_304-black-woman.png"],
  ["amanda-smith", "Amanda Smith", "Administrator", "Helderberg", "398_e206d39e2d5342f4a381c999e19a9d58_t_w_304_h_304-white-woman.png"],
  ["aldin-erenst", "Aldin Erenst", "Administrator", "Student Hub", "398_ff5d3565bc2f41fc9713d7a4ac238be4_t_w_304_h_304-coloured-man.png"],
];
for (const [slug, name, position, location, filename] of agents) {
  const storagePath = `profiles/${slug}.png`;
  const { error: uploadError } = await supabase.storage.from("agent-images").upload(storagePath, readFileSync(join(root, filename)), { upsert: true, contentType: "image/png", cacheControl: "31536000" });
  if (uploadError) throw uploadError;
  const { data: urlData } = supabase.storage.from("agent-images").getPublicUrl(storagePath);
  const profile = { name, slug, position, bio: `${position} serving ${location}. Contact NexaStay for booking assistance.`, phone: "+27730884239", whatsapp: "27730884239", email: `hello@nexastay.co.za`, image_path: storagePath, image_url: urlData.publicUrl, active: true };
  const { data: existing, error: lookupError } = await supabase.from("agents").select("id").eq("slug", slug).maybeSingle();
  if (lookupError) throw lookupError;
  const result = existing ? await supabase.from("agents").update(profile).eq("id", existing.id) : await supabase.from("agents").insert(profile);
  if (result.error) throw result.error;
  console.log(`Imported ${name}`);
}
console.log("Imported 10 additional agents without source phone numbers.");