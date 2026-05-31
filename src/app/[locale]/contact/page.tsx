import { getDictionary, type Locale } from "@/i18n/config";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ContactPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const t = getDictionary(params.locale);
  const settings = await getSettings();

  const items = [
    { icon: "✉️", label: t.contact.email, value: settings.contactEmail, href: `mailto:${settings.contactEmail}` },
    { icon: "📞", label: t.contact.phone, value: settings.contactPhone, href: `tel:${settings.contactPhone}` },
    { icon: "💬", label: t.contact.whatsapp, value: settings.whatsapp, href: `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}` },
  ];

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="section-title">{t.contact.title}</h1>
        <p className="mt-3 text-slate-400">{t.contact.subtitle}</p>
      </div>
      <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-3">
        {items.map((it) => (
          <a
            key={it.label}
            href={it.href}
            className="card flex flex-col items-center gap-2 p-6 text-center transition hover:border-pitch-500/40"
          >
            <span className="text-3xl">{it.icon}</span>
            <span className="text-xs uppercase tracking-wide text-slate-400">
              {it.label}
            </span>
            <span className="font-medium text-white">{it.value}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
