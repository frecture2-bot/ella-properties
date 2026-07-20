import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { SettingsRow } from "@/lib/admin/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const [form, setForm] = useState<Partial<SettingsRow>>({});
  const [saving, setSaving] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      return data as unknown as SettingsRow | null;
    },
  });

  useEffect(() => { if (data) setForm(data); }, [data]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { id: _id, ...update } = form as SettingsRow;
    const { error } = await supabase.from("site_settings").update(update as never).eq("id", 1);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Настройките са запазени");
  }

  const set = <K extends keyof SettingsRow>(k: K, v: SettingsRow[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-navy">Настройки на сайта</h1>
        <p className="text-sm text-muted-foreground">Съдържание, бранд, контакти и социални мрежи</p>
      </div>

      <form onSubmit={save} className="space-y-6">
        <Section title="Бранд и цветове">
          <div className="grid gap-4 sm:grid-cols-2">
            <Row label="Име на бранда"><Input value={form.brand_name ?? ""} onChange={(e) => set("brand_name", e.target.value)} /></Row>
            <Row label="Слоган"><Input value={form.brand_tagline ?? ""} onChange={(e) => set("brand_tagline", e.target.value)} /></Row>
            <Row label="Основен цвят (Navy)">
              <div className="flex items-center gap-2">
                <Input type="color" className="h-10 w-16 p-1" value={form.primary_color ?? "#0B1E3B"} onChange={(e) => set("primary_color", e.target.value)} />
                <Input value={form.primary_color ?? ""} onChange={(e) => set("primary_color", e.target.value)} placeholder="#0B1E3B" />
              </div>
            </Row>
            <Row label="Акцентен цвят (Gold)">
              <div className="flex items-center gap-2">
                <Input type="color" className="h-10 w-16 p-1" value={form.accent_color ?? "#C6A15B"} onChange={(e) => set("accent_color", e.target.value)} />
                <Input value={form.accent_color ?? ""} onChange={(e) => set("accent_color", e.target.value)} placeholder="#C6A15B" />
              </div>
            </Row>
            <Row label="URL на лого"><Input value={form.logo_url ?? ""} onChange={(e) => set("logo_url", e.target.value)} placeholder="https://..." /></Row>
          </div>
        </Section>

        <Section title="Hero секция (начална страница)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Row label="Надзаглавие"><Input value={form.hero_eyebrow ?? ""} onChange={(e) => set("hero_eyebrow", e.target.value)} /></Row>
            <Row label="URL на фоново изображение"><Input value={form.hero_image_url ?? ""} onChange={(e) => set("hero_image_url", e.target.value)} placeholder="https://..." /></Row>
            <div className="sm:col-span-2">
              <Row label="Заглавие"><Textarea rows={2} value={form.hero_title ?? ""} onChange={(e) => set("hero_title", e.target.value)} /></Row>
            </div>
            <div className="sm:col-span-2">
              <Row label="Подзаглавие"><Textarea rows={3} value={form.hero_subtitle ?? ""} onChange={(e) => set("hero_subtitle", e.target.value)} /></Row>
            </div>
            <Row label="Текст на основен бутон"><Input value={form.hero_cta_label ?? ""} onChange={(e) => set("hero_cta_label", e.target.value)} /></Row>
            <Row label="Линк на основен бутон"><Input value={form.hero_cta_link ?? ""} onChange={(e) => set("hero_cta_link", e.target.value)} placeholder="#catalog" /></Row>
            <Row label="Текст на втори бутон"><Input value={form.hero_secondary_cta_label ?? ""} onChange={(e) => set("hero_secondary_cta_label", e.target.value)} /></Row>
            <Row label="Линк на втори бутон"><Input value={form.hero_secondary_cta_link ?? ""} onChange={(e) => set("hero_secondary_cta_link", e.target.value)} placeholder="#contact" /></Row>
          </div>
        </Section>

        <Section title={"Секция „За нас\""}>
          <div className="grid gap-4">
            <Row label="Заглавие"><Input value={form.about_title ?? ""} onChange={(e) => set("about_title", e.target.value)} /></Row>
            <Row label="Основен текст"><Textarea rows={4} value={form.about_text ?? ""} onChange={(e) => set("about_text", e.target.value)} /></Row>
            <Row label="Допълнителен текст"><Textarea rows={3} value={form.about_text_secondary ?? ""} onChange={(e) => set("about_text_secondary", e.target.value)} /></Row>
          </div>
        </Section>

        <Section title="Статистики">
          <div className="grid gap-4 sm:grid-cols-2">
            <Row label="Статистика 1 — стойност"><Input value={form.stat1_value ?? ""} onChange={(e) => set("stat1_value", e.target.value)} placeholder="15+" /></Row>
            <Row label="Статистика 1 — етикет"><Input value={form.stat1_label ?? ""} onChange={(e) => set("stat1_label", e.target.value)} placeholder="години опит" /></Row>
            <Row label="Статистика 2 — стойност"><Input value={form.stat2_value ?? ""} onChange={(e) => set("stat2_value", e.target.value)} /></Row>
            <Row label="Статистика 2 — етикет"><Input value={form.stat2_label ?? ""} onChange={(e) => set("stat2_label", e.target.value)} /></Row>
            <Row label="Статистика 3 — стойност"><Input value={form.stat3_value ?? ""} onChange={(e) => set("stat3_value", e.target.value)} /></Row>
            <Row label="Статистика 3 — етикет"><Input value={form.stat3_label ?? ""} onChange={(e) => set("stat3_label", e.target.value)} /></Row>
          </div>
        </Section>

        <Section title="Контакти">
          <div className="grid gap-4 sm:grid-cols-2">
            <Row label="Телефон 1"><Input value={form.phone1 ?? ""} onChange={(e) => set("phone1", e.target.value)} /></Row>
            <Row label="Телефон 2"><Input value={form.phone2 ?? ""} onChange={(e) => set("phone2", e.target.value)} /></Row>
            <Row label="Имейл"><Input type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} /></Row>
            <Row label="Адрес"><Input value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} /></Row>
          </div>
        </Section>

        <Section title="Социални мрежи">
          <div className="grid gap-4 sm:grid-cols-2">
            <Row label="Facebook URL"><Input value={form.facebook_url ?? ""} onChange={(e) => set("facebook_url", e.target.value)} placeholder="https://facebook.com/..." /></Row>
            <Row label="Instagram URL"><Input value={form.instagram_url ?? ""} onChange={(e) => set("instagram_url", e.target.value)} placeholder="https://instagram.com/..." /></Row>
            <Row label="WhatsApp номер"><Input value={form.whatsapp_number ?? ""} onChange={(e) => set("whatsapp_number", e.target.value)} placeholder="+359..." /></Row>
            <Row label="Viber номер"><Input value={form.viber_number ?? ""} onChange={(e) => set("viber_number", e.target.value)} placeholder="+359..." /></Row>
          </div>
        </Section>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-navy hover:bg-navy-deep">
            {saving ? "Запазване..." : "Запази настройките"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="space-y-5 p-6">
        <h3 className="font-display text-xl text-navy">{title}</h3>
        {children}
      </CardContent>
    </Card>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><Label>{label}</Label><div className="mt-1.5">{children}</div></div>);
}