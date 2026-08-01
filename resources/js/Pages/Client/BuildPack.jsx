import ClientLayout from '@/Layouts/ClientLayout';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { addItemToCart, showAlert } from '@/redux/cartSlice';
import { CheckCircleIcon, MagnifyingGlassIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const copy = {
  en: { eyebrow: 'Made by you', title: 'Build your own gift pack', intro: 'Choose your products, select the perfect package, and add a personal message.', products: 'Choose products', package: 'Choose a package', message: 'Your message', search: 'Search products', all: 'All categories', empty: 'No products match your filters.', selected: 'selected products', packaging: 'Packaging', total: 'Total', add: 'Add custom pack to cart', required: 'Choose at least one product and one package.', placeholder: 'Write the note that should be placed inside the pack…', ready: 'Your custom pack' },
  fr: { eyebrow: 'Créé par vous', title: 'Composez votre coffret cadeau', intro: 'Choisissez vos produits, votre emballage et ajoutez un message personnel.', products: 'Choisissez les produits', package: 'Choisissez un emballage', message: 'Votre message', search: 'Rechercher un produit', all: 'Toutes les catégories', empty: 'Aucun produit ne correspond.', selected: 'produits sélectionnés', packaging: 'Emballage', total: 'Total', add: 'Ajouter le coffret au panier', required: 'Choisissez au moins un produit et un emballage.', placeholder: 'Écrivez le mot à placer dans le coffret…', ready: 'Votre coffret personnalisé' },
  ar: { eyebrow: 'من تصميمك', title: 'كوّن باقة هديتك', intro: 'اختر المنتجات والعلبة المناسبة، ثم أضف رسالة شخصية.', products: 'اختر المنتجات', package: 'اختر العلبة', message: 'رسالتك', search: 'ابحث عن منتج', all: 'كل الأصناف', empty: 'لا توجد منتجات مطابقة.', selected: 'منتجات مختارة', packaging: 'العلبة', total: 'المجموع', add: 'أضف الباقة إلى السلة', required: 'اختر منتجاً واحداً على الأقل وعلبة.', placeholder: 'اكتب الرسالة التي ستوضع داخل الباقة…', ready: 'باقتك المخصصة' },
};

const activeUnitPrice = (product, quantity) => {
  const prices = [...(product.prices || [])].sort((a, b) => Number(a.min_qty) - Number(b.min_qty));
  const tier = [...prices].reverse().find((price) => quantity >= Number(price.min_qty) && (!price.max_qty || quantity <= Number(price.max_qty))) || prices[0];
  if (!tier) return Number(product.price_after_discount || product.price || 0);
  const today = new Date().toISOString().slice(0, 10);
  const discountActive = Number(tier.discount_price) > 0
    && (!tier.start_date || tier.start_date <= today)
    && (!tier.end_date || tier.end_date >= today);
  return Number(discountActive ? tier.discount_price : tier.price);
};

export default function BuildPack({ auth, categories, eventCategories, productCategories, products, packages }) {
  const { i18n, t } = useTranslation();
  const lang = ['en', 'fr', 'ar'].includes(i18n.language) ? i18n.language : 'en';
  const text = copy[lang];
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [quantities, setQuantities] = useState({});
  const [packageId, setPackageId] = useState(null);
  const [message, setMessage] = useState('');
  const [attempted, setAttempted] = useState(false);

  const filtered = useMemo(() => products.filter((product) => {
    const name = product.name?.[lang] || product.name?.en || '';
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || product.categories?.some((item) => String(item.id) === category);
    return matchesSearch && matchesCategory;
  }), [products, search, category, lang]);

  const chosenProducts = products.filter((product) => Number(quantities[product.id]) > 0);
  const chosenPackage = packages.find((item) => item.id === packageId);
  const productsTotal = chosenProducts.reduce((total, product) => total + activeUnitPrice(product, quantities[product.id]) * quantities[product.id], 0);
  const total = productsTotal + Number(chosenPackage?.price || 0);
  const valid = chosenProducts.length > 0 && chosenPackage;

  const changeQuantity = (product, direction) => {
    setQuantities((current) => {
      const step = ['piece', 'pack'].includes(product.unit) ? 1 : 0.1;
      const next = Math.max(0, Math.min(Number(product.stock), Number(current[product.id] || 0) + (direction * step)));
      return { ...current, [product.id]: Math.round((next + Number.EPSILON) * 10) / 10 };
    });
  };

  const setQuantity = (product, value) => {
    const parsed = Number(value);
    const maximum = Number(product.stock);
    const next = Number.isFinite(parsed) ? Math.max(0, Math.min(maximum, parsed)) : 0;
    const normalized = ['piece', 'pack'].includes(product.unit)
      ? Math.floor(next)
      : Math.round((next + Number.EPSILON) * 10) / 10;

    setQuantities((current) => ({ ...current, [product.id]: normalized }));
  };

  const addToCart = () => {
    setAttempted(true);
    if (!valid) return;
    const key = `custom-pack-${Date.now()}`;
    const customPack = {
      id: key,
      cart_key: key,
      type: 'custom_pack',
      unit: 'pack',
      url: null,
      name: { en: 'Your custom gift pack', fr: 'Votre coffret personnalisé', ar: 'باقتك المخصصة' },
      main_image: chosenPackage.image,
      price: Number(total.toFixed(2)),
      price_after_discount: Number(total.toFixed(2)),
      is_discount: false,
      package: chosenPackage,
      custom_message: message.trim(),
      custom_products: chosenProducts.map((product) => ({
        id: product.id,
        name: product.name,
        quantity: quantities[product.id],
        unit: product.unit,
        unit_price: activeUnitPrice(product, quantities[product.id]),
      })),
    };
    dispatch(addItemToCart({ product: customPack, quantity: 1 }));
    dispatch(showAlert({ type: 'success', message: 'cart.product-add-cart-success' }));
    window.location.href = '/checkout';
  };

  return (
    <ClientLayout user={auth?.user} categories={categories} eventCategories={eventCategories}>
      <Head title={text.title} />
      <main className="bg-[#fbfaf6] px-4 pb-20 pt-24 sm:px-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">{text.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-bold text-brown-900 sm:text-6xl">{text.title}</h1>
            <p className="mt-4 text-lg text-gray-600">{text.intro}</p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-10">
              <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-7">
                <h2 className="text-2xl font-bold text-brown-900"><span className="text-primary">1.</span> {text.products}</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_220px]">
                  <label className="relative">
                    <MagnifyingGlassIcon className="absolute start-3 top-3 h-5 w-5 text-gray-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={text.search} className="w-full rounded-xl border-gray-200 py-2.5 ps-10 focus:border-primary focus:ring-primary" />
                  </label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary">
                    <option value="all">{text.all}</option>
                    {productCategories.map((item) => <option key={item.id} value={item.id}>{item.name?.[lang] || item.name?.en}</option>)}
                  </select>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((product) => {
                    const quantity = Number(quantities[product.id] || 0);
                    return <article key={product.id} className={`overflow-hidden rounded-xl border bg-white transition ${quantity ? 'border-primary ring-2 ring-primary/10' : 'border-gray-200'}`}>
                      <img src={`/${product.main_image}`} alt="" className="h-36 w-full object-cover" />
                      <div className="p-4">
                        <h3 className="min-h-12 font-bold text-brown-900">{product.name?.[lang] || product.name?.en}</h3>
                        <p className="mt-1 text-sm font-semibold text-primary">
                          {activeUnitPrice(product, Math.max(quantity, 1)).toFixed(2)} DT
                          {product.unit && <span className="font-medium text-gray-500"> / {t(`product.${product.unit}`)}</span>}
                        </p>
                        <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-1">
                          <button type="button" onClick={() => changeQuantity(product, -1)} disabled={!quantity} className="rounded-md p-2 text-brown-800 hover:bg-white disabled:opacity-30"><MinusIcon className="h-4 w-4" /></button>
                          <input
                            type="number"
                            min="0"
                            max={Number(product.stock)}
                            step={['piece', 'pack'].includes(product.unit) ? 1 : 0.1}
                            value={quantity}
                            onChange={(event) => setQuantity(product, event.target.value)}
                            aria-label={`${product.name?.[lang] || product.name?.en} quantity`}
                            className="w-20 rounded-md border-gray-200 bg-white px-2 py-1 text-center font-bold text-brown-900 focus:border-primary focus:ring-primary"
                          />
                          <button type="button" onClick={() => changeQuantity(product, 1)} disabled={quantity >= Number(product.stock)} className="rounded-md p-2 text-brown-800 hover:bg-white disabled:opacity-30"><PlusIcon className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </article>;
                  })}
                </div>
                {!filtered.length && <p className="py-12 text-center text-gray-500">{text.empty}</p>}
              </section>

              <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-7">
                <h2 className="text-2xl font-bold text-brown-900"><span className="text-primary">2.</span> {text.package}</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {packages.map((item) => <button type="button" key={item.id} onClick={() => setPackageId(item.id)} className={`relative overflow-hidden rounded-xl border text-start transition ${packageId === item.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-primary/50'}`}>
                    {packageId === item.id && <CheckCircleIcon className="absolute end-3 top-3 z-10 h-7 w-7 rounded-full bg-white text-primary" />}
                    <img src={`/${item.image}`} alt="" className="h-40 w-full object-cover" />
                    <div className="p-4"><h3 className="font-bold text-brown-900">{item.name?.[lang] || item.name?.en}</h3><p className="mt-1 text-sm text-gray-500">{item.description?.[lang] || item.description?.en}</p><p className="mt-3 font-bold text-primary">+ {Number(item.price).toFixed(2)} DT</p></div>
                  </button>)}
                </div>
              </section>

              <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-7">
                <h2 className="text-2xl font-bold text-brown-900"><span className="text-primary">3.</span> {text.message}</h2>
                <textarea maxLength="500" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={text.placeholder} rows="5" className="mt-6 w-full rounded-xl border-gray-200 focus:border-primary focus:ring-primary" />
                <p className="mt-2 text-end text-xs text-gray-400">{message.length}/500</p>
              </section>
            </div>

            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 text-brown-900 shadow-xl lg:sticky lg:top-24">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <ShoppingBagIcon className="h-7 w-7 text-primary" />
              </div>
              <h2 className="mt-4 text-2xl font-bold">{text.ready}</h2>
              <p className="mt-2 text-sm text-gray-500">{chosenProducts.length} {text.selected}</p>
              <div className="my-6 space-y-3 border-y border-gray-200 py-5 text-sm text-gray-700">
                {chosenProducts.map((product) => <div key={product.id} className="flex justify-between gap-4"><span>{quantities[product.id]} {product.unit ? t(`product.${product.unit}`) : ''} × {product.name?.[lang] || product.name?.en}</span><span>{(activeUnitPrice(product, quantities[product.id]) * quantities[product.id]).toFixed(2)} DT</span></div>)}
                <div className="flex justify-between gap-4"><span>{text.packaging}</span><span>{chosenPackage ? `${Number(chosenPackage.price).toFixed(2)} DT` : '—'}</span></div>
              </div>
              <div className="flex items-end justify-between"><span className="text-gray-500">{text.total}</span><strong className="text-3xl text-primary">{total.toFixed(2)} DT</strong></div>
              {attempted && !valid && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{text.required}</p>}
              <button type="button" onClick={addToCart} className="mt-6 w-full rounded-xl bg-primary px-4 py-3.5 font-bold text-white transition hover:bg-green-600">{text.add}</button>
              <Link href="/gift-packs" className="mt-4 block text-center text-sm text-gray-500 hover:text-brown-900">← {lang === 'ar' ? 'الباقات الجاهزة' : lang === 'fr' ? 'Voir les coffrets prêts' : 'View ready-made packs'}</Link>
            </aside>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
