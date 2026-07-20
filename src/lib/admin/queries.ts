import { supabase } from "@/integrations/supabase/client";

export type PropertyRow = {
  id: string;
  title: string;
  type: string;
  status: string;
  price: number;
  currency: string;
  city: string | null;
  district: string | null;
  address: string | null;
  area: number | null;
  rooms: number | null;
  floor: string | null;
  description: string | null;
  main_image: string | null;
  video_url: string | null;
  map_lat: number | null;
  map_lng: number | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type InquiryRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  property_id: string | null;
  status: "Ново" | "Обработено" | "Завършено";
  created_at: string;
};

export type TeamRow = {
  id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
  phone: string | null;
  email: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

export type SettingsRow = {
  id: number;
  logo_url: string | null;
  phone1: string | null;
  phone2: string | null;
  email: string | null;
  address: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  whatsapp_number: string | null;
  viber_number: string | null;
  brand_name: string | null;
  brand_tagline: string | null;
  primary_color: string | null;
  accent_color: string | null;
  hero_eyebrow: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_cta_label: string | null;
  hero_cta_link: string | null;
  hero_secondary_cta_label: string | null;
  hero_secondary_cta_link: string | null;
  hero_image_url: string | null;
  about_title: string | null;
  about_text: string | null;
  about_text_secondary: string | null;
  stat1_value: string | null;
  stat1_label: string | null;
  stat2_value: string | null;
  stat2_label: string | null;
  stat3_value: string | null;
  stat3_label: string | null;
  allow_registration: boolean;
};

export async function fetchStats() {
  const [total, active, sold, rent, inquiries] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase.from("properties").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("properties").select("id", { count: "exact", head: true }).in("status", ["Продаден"]),
    supabase.from("properties").select("id", { count: "exact", head: true }).eq("status", "Под наем"),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "Ново"),
  ]);
  return {
    total: total.count ?? 0,
    active: active.count ?? 0,
    sold: sold.count ?? 0,
    rent: rent.count ?? 0,
    newInquiries: inquiries.count ?? 0,
  };
}