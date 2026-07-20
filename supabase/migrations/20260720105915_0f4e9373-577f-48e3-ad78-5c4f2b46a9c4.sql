
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS brand_name text,
  ADD COLUMN IF NOT EXISTS brand_tagline text,
  ADD COLUMN IF NOT EXISTS primary_color text,
  ADD COLUMN IF NOT EXISTS accent_color text,
  ADD COLUMN IF NOT EXISTS hero_eyebrow text,
  ADD COLUMN IF NOT EXISTS hero_title text,
  ADD COLUMN IF NOT EXISTS hero_subtitle text,
  ADD COLUMN IF NOT EXISTS hero_cta_label text,
  ADD COLUMN IF NOT EXISTS hero_cta_link text,
  ADD COLUMN IF NOT EXISTS hero_secondary_cta_label text,
  ADD COLUMN IF NOT EXISTS hero_secondary_cta_link text,
  ADD COLUMN IF NOT EXISTS hero_image_url text,
  ADD COLUMN IF NOT EXISTS about_title text,
  ADD COLUMN IF NOT EXISTS about_text text,
  ADD COLUMN IF NOT EXISTS about_text_secondary text,
  ADD COLUMN IF NOT EXISTS stat1_value text,
  ADD COLUMN IF NOT EXISTS stat1_label text,
  ADD COLUMN IF NOT EXISTS stat2_value text,
  ADD COLUMN IF NOT EXISTS stat2_label text,
  ADD COLUMN IF NOT EXISTS stat3_value text,
  ADD COLUMN IF NOT EXISTS stat3_label text,
  ADD COLUMN IF NOT EXISTS allow_registration boolean NOT NULL DEFAULT false;

UPDATE public.site_settings SET
  brand_name = COALESCE(brand_name, 'Елла Недвижими Имоти'),
  brand_tagline = COALESCE(brand_tagline, 'Недвижими имоти'),
  primary_color = COALESCE(primary_color, '#0B1E3B'),
  accent_color = COALESCE(accent_color, '#C6A15B'),
  hero_eyebrow = COALESCE(hero_eyebrow, 'Агенция в Перник'),
  hero_title = COALESCE(hero_title, 'Вашият надежден партньор в света на недвижимите имоти'),
  hero_subtitle = COALESCE(hero_subtitle, 'Елла Недвижими Имоти — професионално съдействие при покупка, продажба и отдаване под наем на имоти в Перник и региона.'),
  hero_cta_label = COALESCE(hero_cta_label, 'Разгледай имоти'),
  hero_cta_link = COALESCE(hero_cta_link, '#catalog'),
  hero_secondary_cta_label = COALESCE(hero_secondary_cta_label, 'Свържи се с нас'),
  hero_secondary_cta_link = COALESCE(hero_secondary_cta_link, '#contact'),
  about_title = COALESCE(about_title, 'Имоти, избрани с внимание към детайла'),
  about_text = COALESCE(about_text, 'Елла Недвижими Имоти предлага професионални услуги в сферата на недвижимите имоти. Нашата цел е да помогнем на всеки клиент да направи правилния избор при покупка, продажба или отдаване под наем на имот.'),
  about_text_secondary = COALESCE(about_text_secondary, 'Базирани в сърцето на Перник, ние познаваме отлично местния пазар и работим с прозрачност, лично отношение и грижа за дългосрочното доверие на нашите клиенти.'),
  stat1_value = COALESCE(stat1_value, '15+'),
  stat1_label = COALESCE(stat1_label, 'години опит'),
  stat2_value = COALESCE(stat2_value, '500+'),
  stat2_label = COALESCE(stat2_label, 'успешни сделки'),
  stat3_value = COALESCE(stat3_value, '100%'),
  stat3_label = COALESCE(stat3_label, 'коректност')
WHERE id = 1;

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
