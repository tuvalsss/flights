import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, localized, type Locale } from "@/i18n/config";
import { getPackageById, getSettings } from "@/lib/store";
import { isStripeConfigured } from "@/lib/stripe";
import CheckoutForm from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
}: {
  params: { locale: Locale; packageId: string };
}) {
  const { locale, packageId } = params;
  const t = getDictionary(locale);
  const pkg = await getPackageById(packageId);
  if (!pkg) notFound();
  const settings = await getSettings();

  return (
    <div className="container-page py-14">
      <Link
        href={`/${locale}/packages/${pkg.id}`}
        className="text-sm text-slate-400 hover:text-white"
      >
        ← {localized(pkg.name, locale)}
      </Link>
      <header className="mt-6 max-w-2xl">
        <h1 className="section-title">{t.checkout.title}</h1>
        <p className="mt-3 text-slate-400">{t.checkout.subtitle}</p>
      </header>

      <div className="mt-10">
        <CheckoutForm
          locale={locale}
          t={t}
          packageId={pkg.id}
          packageName={localized(pkg.name, locale)}
          unitPrice={pkg.priceFrom}
          currency={settings.currency}
          demo={!isStripeConfigured()}
        />
      </div>
    </div>
  );
}
