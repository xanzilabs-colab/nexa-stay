import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, extname, join } from "node:path";

function readEnv(name) {
  const match = readFileSync(".env.local", "utf8").match(new RegExp(`^${name}=(.*)$`, "m"));
  return match?.[1]?.trim();
}

const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");
if (!url || !serviceRoleKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local.");

const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
const root = process.cwd();
const sources = [
  { folder: "The Blyde", developmentName: "The Blyde", developmentSlug: "the-blyde", city: "Pretoria", suburb: "The Blyde", agentEmail: "bookings@nexastay.co.za" },
  { folder: "Munyaka Waterfall", developmentName: "Munyaka", developmentSlug: "munyaka", city: "Midrand", suburb: "Jukskei View", defaultAddress: "4 Munyaka Drive, Jukskei View, Midrand, 2090, South Africa", agentEmail: "bookings@nexastay.co.za" },
  { folder: "Ellipse Waterfall", jsonFiles: ["listings.json", "listings - ellipse-executive-apartments.json", "listings -kgothatsos-escape-1-bed-condo  - the-solace-midrand.json"], developmentName: "Ellipse", developmentSlug: "ellipse", city: "Midrand", suburb: "Waterfall City", defaultAddress: "48 Magwa Crescent, Waterfall City, Midrand, 2066, South Africa", agentEmail: "bookings@nexastay.co.za", listingIds: ["city-lights-at-ellipse-1-bedroom", "golden-sunrise-suite-at-the-ellipse-waterfall", "lux-exec-apartment-waterfall-ellipses-1bed-1bath", "wanderhaus-haven-ellipse", "the-quanta-ellipse-watefall-midrand", "4316-ellipse-luxury-apartment-waterfall", "ellipse-waterfall-4212", "ellipse-executive-apartments", "kgothatsos-escape-1-bed-condo", "the-solace-midrand"], syntheticListings: [{ listing_id: "stormside-at-ellipse", title: "Stormside at Ellipse, Waterfall", description: "Ellipse Waterfall apartment. Contact NexaStay for current availability and pricing.", price_amount_zar: null, price_period: "price_on_request", bedrooms: null, bathrooms: null, address: "48 Magwa Crescent, Waterfall City, Midrand, 2066, South Africa" }] },
];

function slugify(value) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function contentType(file) { return extname(file).toLowerCase() === ".png" ? "image/png" : "image/jpeg"; }

async function ensureBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw error;
  if (!buckets.some((bucket) => bucket.id === "property-images")) {
    const { error: createError } = await supabase.storage.createBucket("property-images", { public: true });
    if (createError) throw createError;
  }
}

async function getImportAgent() {
  const { data: existing, error } = await supabase.from("agents").select("id").eq("email", "bookings@nexastay.co.za").maybeSingle();
  if (error) throw error;
  if (existing) return existing.id;
  const { data, error: insertError } = await supabase.from("agents").insert({ name: "NexaStay Bookings", slug: "nexastay-bookings", position: "Bookings Team", bio: "NexaStay guest enquiry team.", phone: "+27730884239", whatsapp: "27730884239", email: "bookings@nexastay.co.za", active: true }).select("id").single();
  if (insertError) throw insertError;
  return data.id;
}

async function uploadImages(propertyId, listing, source) {
  const imageDirectory = join(root, "public", "media", source.folder, listing.listing_id, "images");
  if (!existsSync(imageDirectory)) return 0;
  const imageFiles = readdirSync(imageDirectory).filter((file) => /\.(jpe?g|png)$/i.test(file)).sort();
  const imageRows = [];
  for (const [index, filename] of imageFiles.entries()) {
    const storagePath = `${source.developmentSlug}/${listing.listing_id}/${filename}`;
    const bytes = readFileSync(join(imageDirectory, filename));
    const { error: uploadError } = await supabase.storage.from("property-images").upload(storagePath, bytes, { contentType: contentType(filename), upsert: true, cacheControl: "31536000" });
    if (uploadError) throw new Error(`${listing.listing_id}/${filename}: ${uploadError.message}`);
    const { data: publicUrl } = supabase.storage.from("property-images").getPublicUrl(storagePath);
    imageRows.push({ property_id: propertyId, storage_path: storagePath, public_url: publicUrl.publicUrl, alt_text: `${listing.title} image ${index + 1}`, display_order: index, is_primary: index === 0 });
  }
  if (imageRows.length) {
    const { error } = await supabase.from("property_images").upsert(imageRows, { onConflict: "storage_path" });
    if (error) throw error;
  }
  return imageRows.length;
}

async function importSource(source, agentId) {
  const listings = (source.jsonFiles ?? [source.jsonFile ?? "listings.json"])
    .flatMap((jsonFile) => JSON.parse(readFileSync(join(root, "public", "media", source.folder, jsonFile), "utf8")).listings ?? [])
    .filter((listing) => !source.listingIds || source.listingIds.includes(listing.listing_id))
    .concat(source.syntheticListings ?? []);
  let imageCount = 0;
  for (const listing of listings) {
    const slug = `${source.developmentSlug}-${slugify(listing.title)}-${listing.listing_id.toLowerCase()}`;
    const priceAmount = Number(listing.price_amount_zar) > 0 ? Number(listing.price_amount_zar) : 1;
    const pricePeriod = Number(listing.price_amount_zar) > 0 ? (listing.price_period || "per_month") : "price_on_request";
    const payload = { title: listing.title, slug, description: listing.description || "", property_type: "Apartment", development_name: source.developmentName, development_slug: source.developmentSlug, source_listing_id: listing.listing_id, source_url: listing.source_url, price_per_night: priceAmount, price_period: pricePeriod, minimum_nights: 1, bedrooms: listing.bedrooms || 1, bathrooms: listing.bathrooms || 1, max_guests: Math.max((listing.bedrooms || 1) * 2, 2), province: "Gauteng", city: source.city, suburb: source.suburb, address: source.defaultAddress || listing.address || source.suburb, size_m2: listing.size_m2 || null, featured: false, available: true, amenities: [], agent_id: agentId, status: "published" };
    const { data: existing, error: lookupError } = await supabase.from("properties").select("id").eq("source_listing_id", listing.listing_id).maybeSingle();
    if (lookupError) throw new Error(`${listing.listing_id}: ${lookupError.message}`);
    const write = existing
      ? supabase.from("properties").update(payload).eq("id", existing.id).select("id").single()
      : supabase.from("properties").insert(payload).select("id").single();
    const { data: property, error } = await write;
    if (error) throw new Error(`${listing.listing_id}: ${error.message}`);
    imageCount += await uploadImages(property.id, listing, source);
  }
  return { listings: listings.length, images: imageCount };
}

await ensureBucket();
const agentId = await getImportAgent();
let totalListings = 0;
let totalImages = 0;
for (const source of sources) {
  const result = await importSource(source, agentId);
  totalListings += result.listings;
  totalImages += result.images;
  console.log(`${source.developmentName}: ${result.listings} listings, ${result.images} images`);
}
console.log(`Imported ${totalListings} listings and ${totalImages} images.`);