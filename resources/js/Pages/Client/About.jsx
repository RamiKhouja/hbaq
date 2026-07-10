import Contact from '@/Components/Contact'
import ClientLayout from '@/Layouts/ClientLayout'
import {
  ArrowPathIcon,
  BuildingStorefrontIcon,
  CheckBadgeIcon,
  ClockIcon,
  ScaleIcon,
  SparklesIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'
import React from 'react'
import { useTranslation } from 'react-i18next'

function About({auth, about, users, categories, eventCategories}) {
  const {i18n} = useTranslation();
  const lang = i18n.language;
  const isArabic = lang === 'ar';

  const localized = (value) => {
    if (!value) return '';

    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      return parsed?.[lang] || parsed?.en || parsed?.fr || parsed?.ar || '';
    } catch (error) {
      return value;
    }
  };

  const copy = {
    badge: {
      en: 'Fresh wholesale produce',
      fr: 'Produits frais en gros',
      ar: 'جملة خضروات وغلال طازجة',
    },
    heroNote: {
      en: 'Built for restaurants, hotels, retailers, caterers, and professional kitchens that need consistent fresh fruits and vegetables at scale.',
      fr: 'Pensé pour les restaurants, hôtels, détaillants, traiteurs et cuisines professionnelles qui ont besoin de fruits et légumes frais en volume.',
      ar: 'مخصص للمطاعم والنزل والمتاجر والمطابخ المهنية التي تحتاج إلى خضروات وغلال طازجة بكميات ثابتة.',
    },
    stats: [
      { value: '05', label: { en: 'produce families', fr: 'familles de produits', ar: 'عائلات منتجات' } },
      { value: '24h', label: { en: 'fresh order flow', fr: 'cycle de commande frais', ar: 'دورة طلبات طازجة' } },
      { value: 'B2B', label: { en: 'wholesale supply', fr: 'approvisionnement pro', ar: 'توريد بالجملة' } },
    ],
    pillarsTitle: {
      en: 'Wholesale service made for daily produce needs',
      fr: 'Un service de gros adapte aux besoins quotidiens',
      ar: 'خدمة جملة مصممة للاحتياجات اليومية',
    },
    pillars: [
      {
        icon: BuildingStorefrontIcon,
        title: { en: 'Market-grade selection', fr: 'Selection qualite marche', ar: 'اختيار بجودة السوق' },
        text: {
          en: 'Seasonal fruits, vegetables, herbs, and essentials selected for kitchens that buy regularly.',
          fr: 'Fruits, legumes, herbes et essentiels de saison pour les cuisines qui achetent regulierement.',
          ar: 'غلال وخضروات وأعشاب ومستلزمات موسمية مختارة للمطابخ التي تشتري بانتظام.',
        },
      },
      {
        icon: ScaleIcon,
        title: { en: 'Flexible wholesale quantities', fr: 'Quantites de gros flexibles', ar: 'كميات جملة مرنة' },
        text: {
          en: 'Order by case, kilo, pack, or recurring need without losing control of quality or budget.',
          fr: 'Commandez par caisse, kilo, pack ou besoin recurrent sans perdre le controle de la qualite ou du budget.',
          ar: 'اطلب بالصندوق أو الكيلو أو الحزمة أو حسب الحاجة المتكررة مع الحفاظ على الجودة والميزانية.',
        },
      },
      {
        icon: TruckIcon,
        title: { en: 'Reliable delivery rhythm', fr: 'Rythme de livraison fiable', ar: 'نسق توصيل موثوق' },
        text: {
          en: 'A supply flow designed to keep shelves, prep stations, and service lines ready.',
          fr: 'Un flux d approvisionnement concu pour garder les rayons, postes de preparation et services prets.',
          ar: 'تدفق توريد يحافظ على جاهزية الرفوف ومحطات التحضير وخطوط الخدمة.',
        },
      },
    ],
    process: [
      { icon: SparklesIcon, label: { en: 'Source fresh', fr: 'Sourcer frais', ar: 'توريد طازج' } },
      { icon: CheckBadgeIcon, label: { en: 'Check quality', fr: 'Controler la qualite', ar: 'فحص الجودة' } },
      { icon: ArrowPathIcon, label: { en: 'Prepare orders', fr: 'Preparer les commandes', ar: 'تحضير الطلبات' } },
      { icon: ClockIcon, label: { en: 'Deliver on rhythm', fr: 'Livrer au bon rythme', ar: 'توصيل منتظم' } },
    ],
  };

  const tr = (value) => value?.[lang] || value?.en || value?.fr || value?.ar || '';
  const images = [about?.picture_1, about?.picture_2, about?.picture_3, about?.picture_4]
    .map((picture) => picture ? `/${picture}` : '/pictures/default.jpg');

  return (
    <ClientLayout user={auth?.user} categories={categories} eventCategories={eventCategories} noLimits={true}>
      <main className="min-h-screen bg-[#f7f9f2] text-slate-800" dir={isArabic ? 'rtl' : 'ltr'}>
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#eff7df] via-[#f7f9f2] to-[#fff4df]" />
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-2 lg:items-start lg:gap-12 lg:px-8 lg:py-16 xl:max-w-screen-2xl">
            <div className="max-w-3xl lg:pt-4">
              <span className="inline-flex rounded-full border border-green-200 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-700 shadow-sm sm:px-4 sm:text-xs">
                {tr(copy.badge)}
              </span>
              <h1 className={`mt-6 max-w-2xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl ${isArabic ? 'font-hudhud font-medium lg:text-7xl' : ''}`}>
                {localized(about?.title)}
              </h1>
              <p className={`mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg ${isArabic ? 'text-2xl sm:text-3xl' : ''}`}>
                {localized(about?.paragraph_1)}
              </p>
              <p className={`mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base ${isArabic ? 'text-xl' : ''}`}>
                {tr(copy.heroNote)}
              </p>
              <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3">
                {copy.stats.map((item) => (
                  <div key={item.value} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                    <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                    <p className={`mt-1 text-sm font-medium text-slate-600 ${isArabic ? 'text-base' : ''}`}>{tr(item.label)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="mt-8 grid grid-cols-2 gap-3 sm:hidden">
                {images.map((image, index) => (
                  <div key={image + index} className="overflow-hidden rounded-2xl border border-white/70 bg-white p-2 shadow-xl">
                    <img src={image} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
                  </div>
                ))}
              </div>

              <div className="mt-8 hidden justify-end gap-5 overflow-hidden sm:flex sm:gap-8 lg:mt-0">
                <div className="ml-auto w-36 flex-none space-y-5 pt-24 sm:ml-0 sm:w-44 sm:space-y-8 sm:pt-48 lg:order-last lg:pt-24 xl:order-none xl:pt-44">
                  <div className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white p-2 shadow-xl">
                    <img src={images[0]} alt="" className="aspect-[2/3] w-full rounded-[1rem] object-cover" />
                  </div>
                </div>
                <div className="mr-auto w-36 flex-none space-y-5 sm:mr-0 sm:w-44 sm:space-y-8 sm:pt-32 lg:pt-20">
                  <div className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white p-2 shadow-xl">
                    <img src={images[1]} alt="" className="aspect-[2/3] w-full rounded-[1rem] object-cover" />
                  </div>
                  <div className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white p-2 shadow-xl">
                    <img src={images[2]} alt="" className="aspect-[2/3] w-full rounded-[1rem] object-cover" />
                  </div>
                </div>
                <div className="w-36 flex-none space-y-5 pt-16 sm:w-44 sm:space-y-8 sm:pt-0">
                  <div className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white p-2 shadow-xl">
                    <img src={images[3]} alt="" className="aspect-[2/3] w-full rounded-[1rem] object-cover" />
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-3xl bg-white p-4 shadow-xl sm:absolute sm:-bottom-5 sm:left-10 sm:mt-0 sm:p-5">
                <p className="text-sm font-semibold text-slate-900">{tr(copy.badge)}</p>
                <p className="mt-1 text-xl font-bold text-green-700 sm:text-2xl">B2B</p>
                <p className="text-sm text-slate-500">{tr(copy.stats[2].label)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 xl:max-w-screen-2xl">
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit rounded-full bg-green-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
                {tr(copy.pillarsTitle)}
              </span>
              <h2 className={`mt-6 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl ${isArabic ? 'font-hudhud font-medium md:text-5xl' : ''}`}>
                {localized(about?.title_2)}
              </h2>
              <p className={`mt-5 text-sm leading-8 text-slate-600 md:text-base ${isArabic ? 'text-xl md:text-2xl' : ''}`}>
                {localized(about?.paragraph_2)}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {copy.process.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={tr(item.label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className={`text-lg font-semibold text-slate-900 ${isArabic ? 'text-xl' : ''}`}>{tr(item.label)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 xl:max-w-screen-2xl">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-700 to-emerald-500 p-6 text-white shadow-xl sm:p-8 md:p-12">
              <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
                {tr(copy.badge)}
              </span>
              <h2 className={`mt-6 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl ${isArabic ? 'font-hudhud font-medium md:text-5xl' : ''}`}>
                {tr(copy.pillarsTitle)}
              </h2>
              <p className={`mt-4 max-w-2xl text-sm leading-8 text-green-50 md:text-base ${isArabic ? 'text-xl' : ''}`}>
                {tr(copy.heroNote)}
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {copy.pillars.map((pillar) => {
                const Icon = pillar.icon;

                return (
                  <div key={tr(pillar.title)} className="flex items-start gap-3 border-b border-slate-100 py-5 last:border-b-0 last:pb-0 first:pt-0">
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-slate-900 ${isArabic ? 'text-xl' : ''}`}>{tr(pillar.title)}</h3>
                      <p className={`mt-1 text-sm leading-7 text-slate-600 ${isArabic ? 'text-lg' : ''}`}>{tr(pillar.text)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mx-auto mb-20 max-w-7xl px-4 sm:px-6 lg:px-8 xl:max-w-screen-2xl">
          <Contact />
        </div>
      </main>
    </ClientLayout>
  )
}

export default About
