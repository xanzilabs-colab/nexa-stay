export function siteAsset(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return `/media/${path}`;
  return `${baseUrl}/storage/v1/object/public/site-assets/${path.split("/").map(encodeURIComponent).join("/")}`;
}