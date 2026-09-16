import Link from "next/link";
import { sdk } from "@/lib/webiny";
import type { TherapyService } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  individual: "Individual Therapy",
  couples: "Couples & Marriage",
  family: "Family Therapy",
  group: "Group Therapy",
  youth: "Child & Adolescent",
};

export default async function TherapyHomePage() {
  const result = await sdk.cms.listEntries<TherapyService>({
    modelId: "therapyService",
    sort: {
      "values.name": "asc",
    },
    fields: [
      "id",
      "entryId",
      "values { name slug sku category deliveryMethod durationMinutes price shortDescription featuredImage isFeatured }",
    ],
  });

  const services = result.isOk() ? result.value.data : [];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-emerald-100">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-stone-50/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-sm font-semibold text-emerald-50">
              S
            </span>
            <span className="text-lg font-medium tracking-tight text-stone-900">
              Stillwater Therapy
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-stone-600">
            <Link href="#services" className="transition hover:text-stone-900">
              Services
            </Link>
            <Link href="#approach" className="transition hover:text-stone-900">
              Approach
            </Link>
            <Link
              href="#book"
              className="rounded-full bg-emerald-800 px-4 py-2 text-sm font-medium text-stone-50 shadow-sm transition hover:bg-emerald-700"
            >
              Book Consultation
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <span className="inline-flex items-center rounded-full border border-emerald-800/15 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
          Accepting New Virtual & In-Person Clients
        </span>
        <h1 className="mt-6 text-4xl font-serif tracking-tight text-stone-900 sm:text-5xl">
          Grounded care for life’s complex transitions.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
          Evidence-informed psychotherapy designed to help you untangle patterns,
          process burnout, and regain genuine clarity.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="#services"
            className="rounded-lg bg-emerald-800 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
          >
            Explore Modalities
          </Link>
          <Link
            href="#contact"
            className="rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50"
          >
            Insurance & Rates
          </Link>
        </div>
      </section>

      {/* Dynamic Services from Webiny */}
      <section id="services" className="border-t border-stone-200/60 bg-stone-100/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-serif tracking-tight text-stone-900 sm:text-3xl">
              Specialized Care Offerings
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Transparent session fees and modalities managed via Webiny CMS.
            </p>
          </div>

          {result.isFail() && (
            <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
              Could not load services: {result.error.message}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((item) => {
              const vals = item.values;
              if (!vals) return null;

              const categoryLabel = vals.category
                ? CATEGORY_LABELS[vals.category] || vals.category
                : null;

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    {/* Header: Category & Price */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                        {categoryLabel || vals.sku || "Modality"}
                      </span>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-stone-900">
                          ${vals.price}
                        </span>
                        <span className="block text-xs text-stone-500">
                          {vals.durationMinutes ? `/ ${vals.durationMinutes} min` : "/ session"}
                        </span>
                      </div>
                    </div>

                    {/* Service Name */}
                    <h3 className="mt-3 text-lg font-medium text-stone-900">
                      {vals.name}
                    </h3>

                    {/* Short Description */}
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      {vals.shortDescription || "Tailored clinical care designed around your goals."}
                    </p>

                    {/* Format / Delivery Method Tags */}
                    {Array.isArray(vals.deliveryMethod) && vals.deliveryMethod.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {vals.deliveryMethod.map((method) => (
                          <span
                            key={method}
                            className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] font-medium text-stone-600"
                          >
                            {method}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Link */}
                  <div className="mt-6 border-t border-stone-100 pt-4">
                    <Link
                      href={vals.slug ? `/services/${vals.slug}` : "#book"}
                      className="block w-full rounded-md border border-stone-300 py-2 text-center text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}