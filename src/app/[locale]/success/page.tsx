import Link from "next/link";
import { getDictionary, type Locale } from "@/i18n/config";
import { getOrderByReference } from "@/lib/store";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { ref?: string };
}) {
  const t = getDictionary(params.locale);
  const ref = searchParams.ref;
  const order = ref ? await getOrderByReference(ref) : undefined;

  return (
    <div className="container-page py-20">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-pitch-500 to-pitch-700 text-4xl shadow-lg shadow-pitch-600/30">
          ✓
        </div>
        <h1 className="mt-8 font-display text-3xl font-black sm:text-4xl">
          {t.success.title}
        </h1>
        <p className="mt-3 text-slate-400">{t.success.subtitle}</p>

        {ref && (
          <div className="card mt-8 p-6 text-start">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">{t.success.reference}</span>
              <span className="font-mono text-lg font-bold text-pitch-300">
                {ref}
              </span>
            </div>
            {order && (
              <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">{t.checkout.package}</dt>
                  <dd className="font-medium">{order.packageName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">{t.checkout.guests}</dt>
                  <dd className="font-medium">{order.guests}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">{t.checkout.total}</dt>
                  <dd className="font-bold gradient-text">
                    {formatPrice(order.total, order.currency, params.locale)}
                  </dd>
                </div>
              </dl>
            )}
          </div>
        )}

        <p className="mt-6 text-sm text-slate-400">{t.success.emailNote}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/${params.locale}`} className="btn-ghost px-6 py-3">
            {t.success.backHome}
          </Link>
          <Link href={`/${params.locale}/packages`} className="btn-primary px-6 py-3">
            {t.success.browseMore}
          </Link>
        </div>
      </div>
    </div>
  );
}
