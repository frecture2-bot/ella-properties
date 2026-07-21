import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SettingsRow } from "@/lib/admin/queries";

export const DEFAULT_SETTINGS = {
  brand_name: "Елла Недвижими Имоти",
  brand_tagline: "Недвижими имоти",
  primary_color: "#0B1E3B",
  accent_color: "#C6A15B",
  hero_eyebrow: "Агенция в област Перник и София",
  hero_title: "Имоти, избрани с внимание. Сделки, водени с доверие.",
  hero_subtitle:
    "Елла Недвижими Имоти е Вашият дългогодишен партньор при покупка, продажба и отдаване под наем на имоти в област Перник и София. Работим лично, дискретно и с ангажимент за резултат — от първия оглед до подписа при нотариус.",
  hero_cta_label: "Разгледайте имотите",
  hero_cta_link: "#catalog",
  hero_secondary_cta_label: "Свържете се с нас",
  hero_secondary_cta_link: "#contact",
  hero_image_url: "",
  about_title: "Имоти, избрани с внимание към детайла",
  about_text:
    "Елла Недвижими Имоти предлага пълен спектър от професионални услуги в областта на недвижимите имоти. Помагаме на клиентите си да вземат уверени и информирани решения при покупка, продажба или отдаване под наем на имот в област Перник и София.",
  about_text_secondary:
    "С офис в сърцето на Перник и активно присъствие на столичния пазар, ние съчетаваме отлично познаване на региона със столичния опит. Работим прозрачно, дискретно и с грижа за дългосрочното доверие на всеки клиент.",
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