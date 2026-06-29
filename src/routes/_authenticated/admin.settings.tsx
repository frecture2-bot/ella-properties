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
      return data as SettingsRow | null;
    },
  });

  useEffect(() => { if (data) setForm(data); }, [data]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("site_settings").update(form).eq("id", 1);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Настройките са запазени");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-navy">Настройки на сайта</h1>
        <p className="text-sm text-muted-foreground">Контакти, адрес, социални мрежи</p>
      </div>

      <form onSubmit={save}>
        <Card className="border-0 shadow-sm">
          <CardContent className="space-y-5 p-6">
            <h3 className="font-display text-xl text-navy">Контакти</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Row label="Телефон 1"><Input value={form.phone1 ?? ""} onChange={(e) => setForm({ ...form, phone1: e.target.value })} /></Row>
              <Row label="Телефон 2"><Input value={form.phone2 ?? ""} onChange={(e) => setForm({ ...form, phone2: e.target.value })} /></Row>
              <Row label="Имейл"><Input type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Row>
              <Row label="Адрес"><Input value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Row>
            </div>

            <h3 className="font-display text-xl text-navy pt-4">Социални мрежи</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Row label="Facebook URL"><Input value={form.facebook_url ?? ""} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} placeholder="https://facebook.com/..." /></Row>
              <Row label="Instagram URL"><Input value={form.instagram_url ?? ""} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} placeholder="https://instagram.com/..." /></Row>
              <Row label="WhatsApp номер"><Input value={form.whatsapp_number ?? ""} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} placeholder="+359..." /></Row>
              <Row label="Viber номер"><Input value={form.viber_number ?? ""} onChange={(e) => setForm({ ...form, viber_number: e.target.value })} placeholder="+359..." /></Row>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={saving} className="bg-navy hover:bg-navy-deep">
                {saving ? "Запазване..." : "Запази настройките"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><Label>{label}</Label><div className="mt-1.5">{children}</div></div>);
}