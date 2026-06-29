import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Phone,
  MapPin,
  Mail,
  Home as HomeIcon,
  Key,
  Building2,
  FileText,
  Check,
  Star,
  ArrowRight,
  Maximize2,
  Layers,
  Facebook,
  Instagram,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import heroImage from "@/assets/hero.jpg";
import { properties, type PropertyType } from "@/data/properties";

const PHONE_1 = "+359 88 481 6232";
const PHONE_2 = "+359 88 438 8022";
const PHONE_1_TEL = "+359884816232";
const WHATSAPP = "https://wa.me/359884816232";
const VIBER = "viber://chat?number=%2B359884816232";
const MAPS_URL = "https://maps.app.goo.gl/gWxiPmH7sDt9MtwBA";
const MAPS_EMBED =
  "https://www.google.com/maps?q=%D1%83%D0%BB.+%D0%A0%D0%B0%D0%B9%D0%BA%D0%BE+%D0%94%D0%B0%D1%81%D0%BA%D0%B0%D0%BB%D0%BE%D0%B2+4,+%D0%9F%D0%B5%D1%80%D0%BD%D0%B8%D0%BA&output=embed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Елла Недвижими Имоти — Агенция за имоти в Перник" },
      {
        name: "description",
        content:
          "Агенция за недвижими имоти в Перник. Продажба, покупка и наем на апартаменти, къщи, парцели и бизнес имоти. Професионално съдействие и доверие.",
      },
      { name: "keywords", content: "Недвижими имоти Перник, апартаменти Перник, къщи Перник, агенция недвижими имоти Перник" },
      { property: "og:title", content: "Елла Недвижими Имоти — Агенция за имоти в Перник" },
      { property: "og:description", content: "Професионално съдействие при покупка, продажба и отдаване под наем на имоти в Перник." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Catalog />
        <WhyUs />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingContacts />
      <Toaster position="top-center" />
    </div>
  );
}

/* ---------------- Header ---------------- */

const NAV = [
  { href: "#about", label: "За нас" },
  { href: "#services", label: "Услуги" },
  { href: "#catalog", label: "Имоти" },
  { href: "#why", label: "Защо нас" },
  { href: "#testimonials", label: "Отзиви" },
  { href: "#contact", label: "Контакти" },
];

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#top" className="flex items-center gap-2">
          <Logo />
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-foreground/75 transition-colors hover:text-gold"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden lg:flex">
          <Button asChild variant="default" className="bg-navy text-white hover:bg-navy-deep">
            <a href={`tel:${PHONE_1_TEL}`}>
              <Phone className="mr-2 h-4 w-4" />
              {PHONE_1}
            </a>
          </Button>
        </div>
        <button
          aria-label="Меню"
          onClick={() => setOpen((o) => !o)}
          className="rounded-md border border-border p-2 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-3">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-muted"
              >
                {n.label}
              </a>
            ))}
            <a
              href={`tel:${PHONE_1_TEL}`}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-navy px-4 py-3 text-sm font-medium text-white"
            >
              <Phone className="mr-2 h-4 w-4" />
              {PHONE_1}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-gold ring-1 ring-gold/40">
        <span className="font-display text-xl font-semibold leading-none">Е</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-wide text-navy">
          Елла
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Недвижими имоти
        </span>
      </span>
    </span>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="relative">
        <img
          src={heroImage}
          alt="Луксозен апартамент"
          width={1920}
          height={1280}
          className="h-[78vh] min-h-[560px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/85 via-navy-deep/55 to-navy-deep/85" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Агенция в Перник
              </span>
              <h1 className="mt-6 font-display text-4xl font-medium leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                Вашият надежден партньор в света на{" "}
                <span className="italic text-gold">недвижимите имоти</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                Елла Недвижими Имоти — професионално съдействие при покупка,
                продажба и отдаване под наем на имоти в Перник и региона.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-gold px-7 text-navy-deep hover:bg-gold-soft"
                >
                  <a href="#catalog">
                    Разгледай имоти <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/40 bg-white/5 px-7 text-white backdrop-blur hover:bg-white/10 hover:text-white"
                >
                  <a href="#contact">Свържи се с нас</a>
                </Button>
              </div>
              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-8 text-white">
                {[
                  { k: "15+", v: "години опит" },
                  { k: "500+", v: "успешни сделки" },
                  { k: "100%", v: "коректност" },
                ].map((s) => (
                  <div key={s.v}>
                    <dt className="font-display text-3xl text-gold">{s.k}</dt>
                    <dd className="mt-1 text-xs uppercase tracking-[0.15em] text-white/65">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- About ---------------- */

function About() {
  return (
    <section id="about" className="bg-background py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div>
          <SectionEyebrow>За нас</SectionEyebrow>
          <h2 className="mt-4 font-display text-4xl font-medium text-navy sm:text-5xl">
            Имоти, избрани с внимание към детайла
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/75">
            Елла Недвижими Имоти предлага професионални услуги в сферата на
            недвижимите имоти. Нашата цел е да помогнем на всеки клиент да
            направи правилния избор при покупка, продажба или отдаване под наем
            на имот.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Базирани в сърцето на Перник, ние познаваме отлично местния пазар и
            работим с прозрачност, лично отношение и грижа за дългосрочното
            доверие на нашите клиенти.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {[
            { k: "Перник", v: "Локален експерт" },
            { k: "Лично", v: "отношение" },
            { k: "Реални", v: "оферти" },
            { k: "Пълно", v: "съдействие" },
          ].map((c) => (
            <div
              key={c.k}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="font-display text-3xl text-navy">{c.k}</div>
              <div className="mt-1 text-sm uppercase tracking-[0.15em] text-muted-foreground">
                {c.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Services ---------------- */

const SERVICES = [
  {
    icon: HomeIcon,
    title: "Продажба на имоти",
    items: ["Апартаменти", "Къщи", "Парцели", "Бизнес имоти"],
  },
  {
    icon: Key,
    title: "Покупка на имот",
    items: ["Консултация", "Подбор на предложения", "Организиране на огледи"],
  },
  {
    icon: Building2,
    title: "Наеми",
    items: ["Жилищни имоти", "Търговски имоти", "Дългосрочно отдаване"],
  },
  {
    icon: FileText,
    title: "Консултации",
    items: ["Документи", "Сделки", "Финансиране"],
  },
];

function Services() {
  return (
    <section id="services" className="bg-muted/50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>Нашите услуги</SectionEyebrow>
            <h2 className="mt-4 font-display text-4xl font-medium text-navy sm:text-5xl">
              Пълно съдействие на всяка стъпка
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            От първоначална консултация до подпис на нотариус — оставаме до Вас
            през целия процес.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group flex flex-col rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-xl"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-gold ring-1 ring-gold/30">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 font-display text-2xl text-navy">{s.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-foreground/75">
                {s.items.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Catalog ---------------- */

const PROPERTY_TYPES: (PropertyType | "Всички")[] = [
  "Всички",
  "Апартамент",
  "Къща",
  "Парцел",
  "Бизнес имот",
];

function Catalog() {
  const [type, setType] = useState<string>("Всички");
  const [listing, setListing] = useState<string>("Всички");
  const [district, setDistrict] = useState<string>("Всички");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minArea, setMinArea] = useState<string>("");

  const districts = useMemo(
    () => ["Всички", ...Array.from(new Set(properties.map((p) => p.district)))],
    [],
  );

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (type !== "Всички" && p.type !== type) return false;
      if (listing !== "Всички" && p.listing !== listing) return false;
      if (district !== "Всички" && p.district !== district) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (minArea && p.area < Number(minArea)) return false;
      return true;
    });
  }, [type, listing, district, maxPrice, minArea]);

  return (
    <section id="catalog" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionEyebrow>Каталог с имоти</SectionEyebrow>
        <h2 className="mt-4 font-display text-4xl font-medium text-navy sm:text-5xl">
          Актуални оферти в Перник
        </h2>

        <div className="mt-10 grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
          <FilterSelect label="Вид имот" value={type} onChange={setType} options={PROPERTY_TYPES as string[]} />
          <FilterSelect label="Тип сделка" value={listing} onChange={setListing} options={["Всички", "Продажба", "Наем"]} />
          <FilterSelect label="Квартал" value={district} onChange={setDistrict} options={districts} />
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Цена до (€)</Label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="напр. 100000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Квадратура от (м²)</Label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="напр. 60"
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Няма намерени имоти по зададените критерии.
          </div>
        )}
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function PropertyCard({ p }: { p: (typeof properties)[number] }) {
  const priceText = new Intl.NumberFormat("bg-BG").format(p.price);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-navy/95 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur">
          {p.listing}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-navy-deep">
          {p.type}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl text-navy">{p.title}</h3>
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {p.city}, {p.district}
        </p>
        <p className="mt-3 line-clamp-2 text-sm text-foreground/75">{p.description}</p>
        <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-gold" /> {p.area} м²
          </span>
          {p.floor && (
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-gold" /> Етаж {p.floor}
            </span>
          )}
        </div>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Цена</div>
            <div className="font-display text-2xl font-medium text-navy">
              € {priceText}
              {p.listing === "Наем" && (
                <span className="text-sm text-muted-foreground"> /мес.</span>
              )}
            </div>
          </div>
          <Button
            asChild
            className="rounded-full bg-navy text-white hover:bg-navy-deep"
          >
            <a href="#contact">Заяви оглед</a>
          </Button>
        </div>
      </div>
    </article>
  );
}

/* ---------------- Why us ---------------- */

const REASONS = [
  "Професионално отношение",
  "Познаване на местния пазар",
  "Реални оферти",
  "Коректност и доверие",
  "Индивидуален подход към клиента",
];

function WhyUs() {
  return (
    <section id="why" className="relative overflow-hidden bg-navy-deep py-24 text-white lg:py-32">
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionEyebrow tone="gold">Защо да изберете нас</SectionEyebrow>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-medium sm:text-5xl">
          Доверие, изградено върху <span className="italic text-gold">резултати</span>
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => (
            <div
              key={r}
              className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:border-gold/50"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold font-display text-navy-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pt-1.5 text-base font-medium">{r}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */

const TESTIMONIALS = [
  {
    name: "Мария Иванова",
    role: "Купувач, Перник",
    text:
      "Изключително професионално отношение от първия контакт до подписването на договора. Намериха ни апартамента, който мечтаехме.",
  },
  {
    name: "Георги Петров",
    role: "Продавач",
    text:
      "Реализираха сделката бързо и на коректна цена. Спокойствието през целия процес е безценно.",
  },
  {
    name: "Елена Костова",
    role: "Наемател",
    text:
      "Любезни, отзивчиви и с реални оферти. Препоръчвам Елла Недвижими Имоти на всеки!",
  },
];

function Testimonials() {
  return (
    <section id="testimonials" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <SectionEyebrow>Отзиви от клиенти</SectionEyebrow>
          <h2 className="mt-4 font-display text-4xl font-medium text-navy sm:text-5xl">
            Думите на хората, които ни се довериха
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm"
            >
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-foreground/80">
                „{t.text}"
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <div className="font-display text-lg text-navy">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */

function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error("Моля, попълнете задължителните полета.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Благодарим Ви! Ще се свържем с Вас възможно най-скоро.");
      setForm({ name: "", phone: "", email: "", message: "" });
    }, 700);
  }

  return (
    <section id="contact" className="bg-muted/50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <SectionEyebrow>Контакти</SectionEyebrow>
          <h2 className="mt-4 font-display text-4xl font-medium text-navy sm:text-5xl">
            Да поговорим за Вашия имот
          </h2>
          <p className="mt-4 text-muted-foreground">
            Свържете се с нас по удобен за Вас начин или изпратете запитване —
            ще се свържем с Вас в рамките на работния ден.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            <ContactRow
              icon={Phone}
              title="Телефони"
              lines={[
                { text: PHONE_1, href: `tel:${PHONE_1_TEL}` },
                { text: PHONE_2, href: `tel:+359884388022` },
              ]}
            />
            <ContactRow
              icon={MapPin}
              title="Адрес"
              lines={[
                { text: `Център, ул. „Райко Даскалов" 4`, href: MAPS_URL },
                { text: "2300 Перник, България" },
              ]}
            />
            <ContactRow
              icon={Mail}
              title="Имейл"
              lines={[{ text: "office@ella-imoti.bg", href: "mailto:office@ella-imoti.bg" }]}
            />
            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <iframe
                title="Карта — Елла Недвижими Имоти"
                src={MAPS_EMBED}
                width="100%"
                height="280"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-border bg-card p-7 shadow-sm lg:col-span-3 lg:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Име *" value={form.name} onChange={(v) => update("name", v)} />
              <Field label="Телефон *" value={form.phone} onChange={(v) => update("phone", v)} type="tel" />
              <div className="sm:col-span-2">
                <Field label="Имейл" value={form.email} onChange={(v) => update("email", v)} type="email" />
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Съобщение *
                </Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  rows={5}
                  maxLength={1000}
                  placeholder="Разкажете ни какво търсите..."
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={sending}
              size="lg"
              className="mt-7 h-12 w-full rounded-full bg-navy text-white hover:bg-navy-deep sm:w-auto sm:px-10"
            >
              {sending ? "Изпращане..." : "Изпрати запитване"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={200}
      />
    </div>
  );
}

function ContactRow({
  icon: Icon,
  title,
  lines,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  lines: { text: string; href?: string }[];
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy text-gold">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{title}</div>
        <div className="mt-1.5 space-y-0.5">
          {lines.map((l, i) =>
            l.href ? (
              <a
                key={i}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="block text-base font-medium text-navy hover:text-gold"
              >
                {l.text}
              </a>
            ) : (
              <div key={i} className="text-sm text-foreground/70">{l.text}</div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="border-t border-border bg-navy-deep text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-navy-deep ring-1 ring-gold/30">
              <span className="font-display text-xl font-semibold">Е</span>
            </span>
            <div>
              <div className="font-display text-lg text-white">Елла</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/60">
                Недвижими имоти
              </div>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/65">
            Професионална агенция за недвижими имоти в Перник. Сделки с доверие
            от 2009 г.
          </p>
        </div>
        <div>
          <h4 className="font-display text-base text-gold">Навигация</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-gold">{n.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base text-gold">Контакт</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={`tel:${PHONE_1_TEL}`} className="hover:text-gold">{PHONE_1}</a></li>
            <li><a href="tel:+359884388022" className="hover:text-gold">{PHONE_2}</a></li>
            <li><a href={MAPS_URL} target="_blank" rel="noreferrer" className="hover:text-gold">{`ул. „Райко Даскалов" 4, Перник`}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base text-gold">Социални мрежи</h4>
          <div className="mt-4 flex gap-3">
            <SocialLink href="https://facebook.com" label="Facebook"><Facebook className="h-4 w-4" /></SocialLink>
            <SocialLink href="https://instagram.com" label="Instagram"><Instagram className="h-4 w-4" /></SocialLink>
            <SocialLink href={WHATSAPP} label="WhatsApp"><MessageCircle className="h-4 w-4" /></SocialLink>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Елла Недвижими Имоти. Всички права запазени.
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-gold hover:bg-gold hover:text-navy-deep"
    >
      {children}
    </a>
  );
}

/* ---------------- Floating contacts ---------------- */

function FloatingContacts() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <FloatBtn href={WHATSAPP} label="WhatsApp" className="bg-[#25D366] hover:brightness-110">
        <MessageCircle className="h-6 w-6" />
      </FloatBtn>
      <FloatBtn href={VIBER} label="Viber" className="bg-[#7360F2] hover:brightness-110">
        <Phone className="h-5 w-5" />
      </FloatBtn>
    </div>
  );
}

function FloatBtn({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={cn(
        "grid h-12 w-12 place-items-center rounded-full text-white shadow-lg ring-2 ring-white/40 transition-transform hover:scale-110",
        className,
      )}
    >
      {children}
    </a>
  );
}

/* ---------------- Shared ---------------- */

function SectionEyebrow({
  children,
  tone = "navy",
}: {
  children: React.ReactNode;
  tone?: "navy" | "gold";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em]",
        tone === "navy" ? "text-navy" : "text-gold",
      )}
    >
      <span className={cn("h-px w-8", tone === "navy" ? "bg-gold" : "bg-gold")} />
      {children}
    </span>
  );
}
