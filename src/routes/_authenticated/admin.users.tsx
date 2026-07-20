import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserCheck, UserX } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import type { SettingsRow } from "@/lib/admin/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersAdmin,
});

function UsersAdmin() {
  const [allow, setAllow] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["admin-users-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      return data as unknown as SettingsRow | null;
    },
  });

  useEffect(() => { if (data) setAllow(!!data.allow_registration); }, [data]);

  const { data: roles } = useQuery({
    queryKey: ["admin-users-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id, role, created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function toggle(next: boolean) {
    setSaving(true);
    setAllow(next);
    const { error } = await supabase.from("site_settings").update({ allow_registration: next } as never).eq("id", 1);
    setSaving(false);
    if (error) {
      setAllow(!next);
      toast.error(error.message);
      return;
    }
    toast.success(next ? "Регистрацията е разрешена" : "Регистрацията е забранена");
    refetch();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-navy">Потребители</h1>
        <p className="text-sm text-muted-foreground">Контрол на достъпа до админ панела</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`grid h-12 w-12 place-items-center rounded-xl ${allow ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {allow ? <UserCheck className="h-5 w-5" /> : <UserX className="h-5 w-5" />}
              </div>
              <div>
                <Label className="text-base font-semibold text-navy">Разреши регистрация на нови потребители</Label>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  Когато е включено, посетителите могат да създадат акаунт от страницата за вход. Новорегистрираните потребители нямат достъп до админ панела, докато не им бъде дадена роля (admin или editor).
                </p>
              </div>
            </div>
            <Switch checked={allow} onCheckedChange={toggle} disabled={saving} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-display text-xl text-navy">Потребители с достъп</h3>
          <p className="mt-1 text-sm text-muted-foreground">Списък с администратори и редактори (по user_id)</p>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2 pr-6">User ID</th>
                  <th className="py-2 pr-6">Роля</th>
                  <th className="py-2">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(roles ?? []).map((r) => (
                  <tr key={`${r.user_id}-${r.role}`}>
                    <td className="py-3 pr-6 font-mono text-xs">{r.user_id}</td>
                    <td className="py-3 pr-6">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${r.role === "admin" ? "bg-gold/20 text-navy" : "bg-slate-100 text-slate-700"}`}>{r.role}</span>
                    </td>
                    <td className="py-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString("bg-BG")}</td>
                  </tr>
                ))}
                {(roles ?? []).length === 0 && (
                  <tr><td colSpan={3} className="py-8 text-center text-muted-foreground">Няма записи</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}