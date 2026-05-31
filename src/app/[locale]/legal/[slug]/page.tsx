import { notFound } from "next/navigation";
import { getDictionary, type Locale } from "@/i18n/config";
import { getSettings } from "@/lib/store";

export default async function LegalPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const t = getDictionary(params.locale);
  const settings = await getSettings();
  if (params.slug !== "terms" && params.slug !== "privacy") notFound();

  const title = params.slug === "terms" ? t.footer.terms : t.footer.privacy;

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="section-title">{title}</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-300">
          <p>{t.footer.disclaimer}</p>
          <p>
            {settings.brand} — {settings.contactEmail} · {settings.contactPhone}
          </p>
          <p className="text-slate-500">
            © {new Date().getFullYear()} {settings.brand}. {t.footer.rights}
          </p>
        </div>
      </div>
    </div>
  );
}
