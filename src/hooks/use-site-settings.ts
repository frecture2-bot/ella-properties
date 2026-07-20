import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SettingsRow } from "@/lib/admin/queries";

export const DEFAULT_SETTINGS = {
  brand_name: "Елла Недвижими Имоти",
  brand_tagline: "Недвижими имоти",
  primary_color: "#0B1E3B",
  accent_color: "#C6A15B",
  hero_eyebrow: "Агенция в Перник",
  hero_title: "Вашият надежден партньор в света на недвижимите имоти",
  hero_subtitle:
    "Елла Недвижими Имоти — професионално съдействие при покупка, продажба и отдаване под наем на имоти в Перник и региона.",
  hero_cta_label: "Разгледай имоти",
  hero_cta_link: "#catalog",
  hero_secondary_cta_label: "Свържи се с нас",
  hero_secondary_cta_link: "#contact",
  hero_image_url: "",
  about_title: "Имоти, избрани с внимание към детайла",
  about_text:
    "Елла Недвижими Имоти предлага професионални услуги в сферата на недвижимите имоти. Нашата цел е да помогнем на всеки клиент да направи правилния избор при покупка, продажба или отдаване под наем на имот.",
  about_text_secondary:
    "Базирани в сърцето на Перник, ние познаваме отлично местния пазар и работим с прозрачност, лично отношение и грижа за дългосрочното доверие на нашите клиенти.",
  stat1_value: "15+",
  stat1_label: "години опит",
  stat2_value: "500+",
  stat2_label: "успешни сделки",
  stat3_value: "100%",
  stat3_label: "коректност",
  allow_registration: false,
};

export type PublicSettings = typeof DEFAULT_SETTINGS;

export function useSiteSettings(): PublicSettings {
  const { data } = useQuery({
    queryKey: ["public-site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as SettingsRow | null;
    },
    staleTime: 60_000,
  });
  const merged: PublicSettings = { ...DEFAULT_SETTINGS };
  if (data) {
    for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof PublicSettings)[]) {
      const v = (data as Record<string, unknown>)[key];
      if (v !== null && v !== undefined && v !== "") {
        (merged as Record<string, unknown>)[key] = v;
      }
    }
  }
  return merged;
}