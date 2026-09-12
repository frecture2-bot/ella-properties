import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(5).max(40).regex(/^[0-9+()\s\-./]+$/, "invalid_phone"),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
  property_id: z.string().uuid().optional(),
  /** Honeypot: real users never fill this. */
  website: z.string().max(200).optional(),
  /** Client timestamp when the form was rendered; blocks instant bot submissions. */
  started_at: z.number().int().optional(),
});

export type InquiryInput = z.input<typeof inquirySchema>;

async function clientKey(): Promise<string> {
  const req = getRequest();
  const ip =
    req?.headers.get("cf-connecting-ip") ??
    req?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req?.headers.get("x-real-ip") ??
    "unknown";
  const ua = req?.headers.get("user-agent") ?? "";
  const salt = process.env["SUPABASE_URL"] ?? "ella";
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}|${ip}|${ua.slice(0, 64)}`));
  return Array.from(new Uint8Array(buf).slice(0, 16), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Public inquiry submission. Validates input, drops obvious bots (honeypot / too-fast submit),
 * then delegates to the DB function `submit_inquiry`, which enforces per-visitor and global
 * hourly rate limits and is the only path allowed to insert inquiries.
 */
export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    // Silently accept bot submissions without storing anything.
    if (data.website && data.website.trim() !== "") return { ok: true as const };
    if (data.started_at && Date.now() - data.started_at < 2500) return { ok: true as const };

    const key = await clientKey();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.rpc("submit_inquiry", {
      _name: data.name,
      _phone: data.phone,
      _email: data.email && data.email !== "" ? data.email : null,
      _message: data.message,
      _property_id: data.property_id ?? null,
      _client_key: key,
    });

    if (error) {
      if (error.message.includes("rate_limited")) {
        return { ok: false as const, reason: "rate_limited" as const };
      }
      console.error("[submitInquiry]", error.message);
      return { ok: false as const, reason: "error" as const };
    }
    return { ok: true as const };
  });
