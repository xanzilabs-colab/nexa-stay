export type PropertyImage = { id: string; public_url: string; alt_text: string; is_primary: boolean; display_order: number };

export type Agent = {
  id: string; name: string; slug: string; position: string; bio: string; phone: string;
  whatsapp: string; email: string; image_url: string; active: boolean;
};

export type Property = {
  id: string; title: string; slug: string; description: string; property_type: string;
  development_name: string; development_slug: string;
  price_per_night: number; price_period?: string; minimum_nights: number; bedrooms: number; bathrooms: number;
  max_guests: number; province: string; city: string; suburb: string; address: string;
  featured: boolean; available: boolean; amenities: string[]; agent: Agent; images: PropertyImage[];
};