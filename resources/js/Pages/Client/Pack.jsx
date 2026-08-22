import { Head, Link } from '@inertiajs/react';
import { Tab } from '@headlessui/react';
import parse from 'html-react-parser';
import { Gift, MinusCircle, Package, PlusCircle, Scale, ShoppingCart, Sparkles, Tag } from 'lucide-react';
import ClientLayout from '@/Layouts/ClientLayout';
import PackCard from '@/Components/home/PackCard';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart, showAlert } from '@/redux/cartSlice';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const numberValue = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function Pack({ auth, categories, eventCategories, pack, related }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const lang = i18n.language;
  const [quantity, setQuantity] = useState(1);
  const title = pack.name?.[lang] || pack.name?.en;
  const description = pack.description?.[lang] || pack.description?.en;
  const images = [
    { id: 'main', path: pack.main_image },
    ...(pack.pictures || []),
  ];
  const hasDiscount = Boolean(pack.is_discount);
  const price = numberValue(pack.price_after_discount || pack.price).toFixed(2);
  const originalPrice = numberValue(pack.price).toFixed(2);
  const packForCart = {
    ...pack,
    cart_key: `pack-${pack.id}`,
    item_type: 'pack',
    unit: 'pack',
    price: numberValue(pack.price),
    price_after_discount: numberValue(pack.price_after_discount || pack.price),
  };

  const addPack = () => {
    dispatch(addItemToCart({ product: packForCart, quantity }));
    dispatch(showAlert({ type: 'success', message: 'cart.product-add-cart-success' }));
  };

  return (
    <ClientLayout user={auth?.user} categories={categories} eventCategories={eventCategories}>
      <Head title={title} />
      <main className="bg-[#f7f9f2] pt-24 text-slate-800" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:px-8 lg:pb-20">
          <div>
            <Tab.Group as="div" className="space-y-4">
              <Tab.Panels>
                {images.map((image) => (
                  <Tab.Panel key={image.id} className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <img
                      src={`/${image.path}`}
                      alt={title}
                      className="h-[360px] w-full object-cover sm:h-[520px]"
                    />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      {hasDiscount && <Badge label={`-${Math.round(numberValue(pack.discount_percentage))}%`} />}
                      {pack.is_featured && <Badge label={lang === 'ar' ? 'مميز' : 'Featured'} />}
                      {pack.is_new && <Badge label={lang === 'ar' ? 'جديد' : 'New'} />}
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>

              {images.length > 1 && (
                <Tab.List className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                  {images.map((image) => (
                    <Tab
                      key={image.id}
                      className="relative h-20 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 focus:outline-none"
                    >
                      {({ selected }) => (
                        <>
                          <img src={`/${image.path}`} alt={title} className="h-full w-full object-cover" />
                          <span className={classNames(
                            selected ? 'ring-2 ring-primary ring-offset-2' : 'ring-0',
                            'pointer-events-none absolute inset-0 rounded-lg'
                          )} />
                        </>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              )}
            </Tab.Group>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <Link href="/gift-packs" className="text-sm font-semibold text-green-700 hover:text-brown-800">
              {lang === 'ar' ? 'كل باقات الهدايا' : 'All gift packs'}
            </Link>
            <div className="mt-4 flex items-start gap-4">
              <div className="rounded-2xl bg-green-100 p-3 text-green-800">
                <Gift className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
                  {lang === 'ar' ? 'باقة هدايا' : 'Gift pack'}
                </p>
                <h1 className={`${lang === 'ar' ? 'font-hudhud text-5xl lg:text-7xl' : 'text-4xl font-bold lg:text-6xl'} mt-2 text-brown-800`}>
                  {title}
                </h1>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <p className="text-4xl font-bold text-green-700 lg:text-5xl">
                {price} <span className="text-2xl">{t('product.tnd')}</span>
              </p>
              {hasDiscount && (
                <p className="pb-1 text-xl font-semibold text-slate-400 line-through">
                  {originalPrice} {t('product.tnd')}
                </p>
              )}
            </div>

            {description && (
              <div className={`${lang === 'ar' ? 'text-xl leading-9' : 'text-base leading-7'} mt-6 text-slate-700`}>
                {parse(description)}
              </div>
            )}

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Stat icon={Package} label={lang === 'ar' ? 'المنتجات' : 'Products'} value={pack.products?.length || 0} />
              <Stat icon={Scale} label={lang === 'ar' ? 'الوزن' : 'Weight'} value={`${numberValue(pack.weight).toFixed(2)} kg`} />
              <Stat
                icon={Sparkles}
                label={lang === 'ar' ? 'المخزون' : 'Stock'}
                value={numberValue(pack.stock) > 0 ? (lang === 'ar' ? 'متوفر' : 'In stock') : (lang === 'ar' ? 'غير متوفر' : 'Out of stock')}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center">
              <div className="flex h-12 items-center justify-between rounded-full border border-slate-200 bg-slate-50 px-3 sm:w-40">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  disabled={quantity <= 1}
                  className="text-primary transition hover:text-brown-800 disabled:text-slate-300"
                  aria-label="Decrease pack quantity"
                >
                  <MinusCircle className="h-6 w-6" />
                </button>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                  className="w-14 border-0 bg-transparent p-0 text-center text-lg font-bold text-brown-800 focus:ring-0"
                  aria-label="Pack quantity"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="text-primary transition hover:text-brown-800"
                  aria-label="Increase pack quantity"
                >
                  <PlusCircle className="h-6 w-6" />
                </button>
              </div>
              <button
                type="button"
                onClick={addPack}
                className="inline-flex h-12 flex-1 items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-white shadow-sm transition hover:bg-brown-700"
              >
                <ShoppingCart className="h-5 w-5" />
                {t('owl-products.add-cart')}
              </button>
            </div>

            <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-2 text-brown-800">
                <Tag className="h-5 w-5" />
                <h2 className="text-lg font-bold">{lang === 'ar' ? 'محتوى الباقة' : 'What is inside'}</h2>
              </div>
              <div className="mt-4 divide-y divide-slate-100">
                {(pack.products || []).map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.url}`}
                    className="flex items-center gap-4 py-4 transition hover:bg-slate-50"
                  >
                    <img src={`/${product.main_image}`} alt={product.name?.[lang] || product.name?.en} className="h-16 w-16 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">{product.name?.[lang] || product.name?.en}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {product.pivot?.quantity ? `${product.pivot.quantity} ${lang === 'ar' ? 'قطع' : 'pcs'}` : null}
                        {product.pivot?.quantity && product.pivot?.weight ? ' / ' : null}
                        {product.pivot?.weight ? `${product.pivot.weight} kg` : null}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {related?.length > 0 && (
          <section className="bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
                  {lang === 'ar' ? 'اقتراحات' : 'Suggestions'}
                </p>
                <h2 className="mt-2 text-3xl font-bold text-brown-800">
                  {lang === 'ar' ? 'باقات أخرى قد تعجبك' : 'More packs you may like'}
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {related.map((item) => <PackCard key={item.id} pack={item} />)}
              </div>
            </div>
          </section>
        )}
      </main>
    </ClientLayout>
  );
}

function Badge({ label }) {
  return (
    <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-sm">
      {label}
    </span>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <Icon className="h-5 w-5 text-green-700" />
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-brown-800">{value}</p>
    </div>
  );
}
