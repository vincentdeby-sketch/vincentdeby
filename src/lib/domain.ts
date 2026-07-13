export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Property = {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string | null;
  postal_code: string | null;
  price: number;
  surface: number | null;
  rooms: number | null;
  bedrooms: number | null;
  property_type: string;
  cover_url: string | null;
  photos: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Estimation = {
  id: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  property_type: string;
  details: Record<string, unknown>;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  status: string;
  created_at: string;
};

export const formatEUR = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
