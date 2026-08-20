import { agents, properties } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/types/property";

export async function getProperties(): Promise<Property[]> {
  const supabase = await createClient();
  if (!supabase) return properties;
  const { data, error } = await supabase.from("properties").select("*, agent:agents(*), images:property_images(*)").eq("status", "published").order("created_at", { ascending: false });
  const records = data as Property[] | null;
  if (error || !records?.some((property) => property.development_slug)) return properties;
  const { data: fallbackAgent } = await supabase.from("agents").select("*").eq("active", true).order("created_at").limit(1).maybeSingle();
  return records.map((property) => ({ ...property, agent: property.agent ?? fallbackAgent ?? agents[0], images: property.images ?? [] }));
}
export async function getProperty(slug: string) { return (await getProperties()).find((property) => property.slug === slug); }
export async function getAgents() { const supabase = await createClient(); if (!supabase) return agents; const { data } = await supabase.from("agents").select("*").eq("active", true); return data?.length ? data : agents; }