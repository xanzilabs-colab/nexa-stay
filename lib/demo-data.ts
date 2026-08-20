import type { Agent, Property } from "@/types/property";

export const agents: Agent[] = [
  ["sarah-mokoena", "Naledi Mokoena", "Rental Specialist", "Helping guests find easy, comfortable stays across Waterfall City."],
  ["thabo-ndlovu", "Sibusiso Dlamini", "Guest Experience Lead", "Local advice and thoughtful support from enquiry to arrival."],
  ["zola-williams", "Daniel Williams", "Coastal Stays Consultant", "Clear, practical help for every NexaStay guest."],
  ["lerato-khumalo", "Thabang Khumalo", "Property Advisor", "Pairing guests with the right apartment and a seamless stay."],
  ["matthew-naidoo", "Catherine De Beers", "Stay Coordinator", "Making every booking and arrival feel simple and well looked after."],
].map(([slug, name, position, bio], index) => ({
  id: `agent-${index + 1}`, slug, name, position, bio, active: true,
  phone: `+27 12 555 01${index + 1}`, whatsapp: `2782555010${index + 1}`,
  email: `${slug}@nexastay.co.za`, image_url: "",
}));

const bases = [
  ["Ellipse One Bedroom Apartment", "ellipse-one-bedroom-apartment", "Ellipse", "ellipse", "Gauteng", "Johannesburg", "Waterfall City", 1550, 1, 1, 2],
  ["Ellipse Two Bedroom Apartment", "ellipse-two-bedroom-apartment", "Ellipse", "ellipse", "Gauteng", "Johannesburg", "Waterfall City", 2200, 2, 2, 4],
  ["Ellipse Executive Two Bedroom", "ellipse-executive-two-bedroom", "Ellipse", "ellipse", "Gauteng", "Johannesburg", "Waterfall City", 2600, 2, 2, 4],
  ["Munyaka One Bedroom Lagoon Apartment", "munyaka-one-bedroom-lagoon", "Munyaka", "munyaka", "Gauteng", "Johannesburg", "Waterfall City", 1650, 1, 1, 2],
  ["Munyaka Two Bedroom Lagoon Apartment", "munyaka-two-bedroom-lagoon", "Munyaka", "munyaka", "Gauteng", "Johannesburg", "Waterfall City", 2300, 2, 2, 4],
  ["Munyaka Three Bedroom Apartment", "munyaka-three-bedroom-apartment", "Munyaka", "munyaka", "Gauteng", "Johannesburg", "Waterfall City", 2950, 3, 2, 6],
  ["The Blyde One Bedroom Apartment", "the-blyde-one-bedroom-apartment", "The Blyde", "the-blyde", "Gauteng", "Pretoria", "The Blyde", 1450, 1, 1, 2],
  ["The Blyde Two Bedroom Apartment", "the-blyde-two-bedroom-apartment", "The Blyde", "the-blyde", "Gauteng", "Pretoria", "The Blyde", 2100, 2, 2, 4],
  ["The Blyde Family Three Bedroom", "the-blyde-family-three-bedroom", "The Blyde", "the-blyde", "Gauteng", "Pretoria", "The Blyde", 2750, 3, 2, 6],
] as const;

export const properties: Property[] = bases.map((item, index) => {
  const [title, slug, developmentName, developmentSlug, province, city, suburb, price, bedrooms, bathrooms, maxGuests] = item;
  const agent = agents[index % agents.length];
  return { id: `property-${index + 1}`, title, slug, development_name: developmentName, development_slug: developmentSlug, province, city, suburb, price_per_night: price,
    bedrooms, bathrooms, max_guests: maxGuests, agent, featured: index < 6, available: true,
    property_type: bedrooms > 2 ? "House" : "Apartment", minimum_nights: 2, address: `${suburb}, ${city}`,
    description: `A considered short-term unit at ${developmentName}, designed for guests who value comfort, location, and an easy arrival.`,
    amenities: ["WiFi", "Parking", "Kitchen", "Workspace", "TV"],
    images: [],
  };
});