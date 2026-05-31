import { getDictionary, type Locale } from "@/i18n/config";
import { getPackages, getSettings } from "@/lib/store";
import PackageList from "@/components/PackageList";

export const dynamic = "force-dynamic";

export default async function PackagesPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const t = getDictionary(params.locale);
  const packages = await getPackages();
  const settings = await getSettings();

  return (
    <div className="container-page py-14">
      <header className="max-w-2xl">
        <h1 className="section-title">{t.packages.title}</h1>
        <p className="mt-3 text-slate-400">{t.packages.subtitle}</p>
      </header>
      <div className="mt-10">
        <PackageList
          packages={packages}
          locale={params.locale}
          t={t}
          currency={settings.currency}
        />
      </div>
    </div>
  );
}
