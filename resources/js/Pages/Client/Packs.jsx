import ClientLayout from '@/Layouts/ClientLayout';
import PackCard from '@/Components/home/PackCard';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Packs({ auth, packs, categories, eventCategories, packCategories = [], selectedCategory = null }) {
  const { i18n } = useTranslation();
  const packList = packs?.data || [];

  const paginationLabel = (label) => {
    if (label.includes('Previous')) {
      return i18n.language === 'ar' ? 'السابق' : i18n.language === 'fr' ? 'Precedent' : 'Previous';
    }

    if (label.includes('Next')) {
      return i18n.language === 'ar' ? 'التالي' : i18n.language === 'fr' ? 'Suivant' : 'Next';
    }

    return label;
  };

  return (
    <ClientLayout showMain={false} user={auth?.user} categories={categories} eventCategories={eventCategories}>
      <Head title="Gift Packs" />
      <div className="w-full px-6 py-24 lg:px-0" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
            <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
              {i18n.language === 'ar' ? 'باقات الهدايا' : 'Gift Packs'}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-brown-800 lg:text-5xl">
              {i18n.language === 'ar' ? 'باقات حبق الجاهزة' : 'Hbaq gift packs'}
            </h1>
            </div>
            <Link href="/gift-packs/build-your-own" className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow hover:bg-brown-800">
              {i18n.language === 'ar' ? 'كوّن باقتك' : i18n.language === 'fr' ? 'Composez votre coffret' : 'Build your own pack'}
            </Link>
          </div>

          {packCategories.length > 0 && (
            <div className="mb-10 overflow-x-auto pb-2">
              <div className="flex min-w-max items-center gap-3">
                <Link
                  href="/gift-packs"
                  preserveScroll
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    !selectedCategory
                      ? 'bg-primary text-white shadow'
                      : 'bg-white text-brown-800 ring-1 ring-inset ring-gray-200 hover:bg-green-50 hover:ring-green-600'
                  }`}
                >
                  {i18n.language === 'ar' ? 'الكل' : i18n.language === 'fr' ? 'Tous' : 'All'}
                </Link>
                {packCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/gift-packs?category=${category.id}`}
                    preserveScroll
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                      Number(selectedCategory) === category.id
                        ? 'bg-primary text-white shadow'
                        : 'bg-white text-brown-800 ring-1 ring-inset ring-gray-200 hover:bg-green-50 hover:ring-green-600'
                    }`}
                  >
                    {category.name?.[i18n.language] || category.name?.fr || category.name?.en}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {packList.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {packList.map((pack) => <PackCard key={pack.id} pack={pack} />)}
            </div>
          ) : (
            <div className="rounded-md border border-gray-200 bg-white py-16 text-center font-semibold text-brown-800">
              {i18n.language === 'ar' ? 'لا توجد باقات حالياً' : 'No gift packs found'}
            </div>
          )}

          {packs?.links?.length > 3 && (
            <div className="mt-12 grid grid-flow-col auto-cols-max items-center justify-center gap-2 overflow-x-auto">
              {packs.links.map((link, index) => (
                link.url ? (
                  <Link
                    key={`${link.label}-${index}`}
                    href={link.url}
                    preserveScroll
                    className={`min-w-10 rounded-md px-3 py-2 text-center text-sm font-semibold ring-1 ring-inset ${
                      link.active
                        ? 'bg-primary text-white ring-primary'
                        : 'bg-white text-primary ring-primary hover:bg-brown-800 hover:text-white'
                    }`}
                  >
                    {paginationLabel(link.label)}
                  </Link>
                ) : (
                  <span key={`${link.label}-${index}`} className="min-w-10 rounded-md px-3 py-2 text-center text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-200">
                    {paginationLabel(link.label)}
                  </span>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
