import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";

function environmentValue(name) {
  const match = readFileSync(".env.local", "utf8").match(new RegExp(`^${name}=(.*)$`, "m"));
  return match?.[1]?.trim();
}

const url = environmentValue("NEXT_PUBLIC_SUPABASE_URL");
const key = environmentValue("SUPABASE_SERVICE_ROLE_KEY");
if (!url || !key) throw new Error("Supabase URL and service role key are required.");
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const mediaRoot = join(process.cwd(), "public", "media");
const rootFiles = ["logo.png", "logo-icon.jpg", ...readdirSync(mediaRoot).filter((name) => /^ssstik\.io_.*\.(jpg|mp4)$/i.test(name))];
const heroFiles = readdirSync(join(mediaRoot, "hero")).filter((name) => /\.(jpg|jpeg|png|webp)$/i.test(name)).map((name) => `hero/${name}`);

function contentType(filename) {
  const extension = extname(filename).toLowerCase();
  if (extension === ".mp4") return "video/mp4";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  return "image/jpeg";
}

for (const assetPath of [...rootFiles, ...heroFiles]) {
  const localPath = join(mediaRoot, assetPath);
  const { error } = await supabase.storage.from("site-assets").upload(assetPath, readFileSync(localPath), { upsert: true, cacheControl: "31536000", contentType: contentType(assetPath) });
  if (error) throw new Error(`${assetPath}: ${error.message}`);
  console.log(`Uploaded ${assetPath}`);
}

console.log("Site assets uploaded to Supabase Storage.");