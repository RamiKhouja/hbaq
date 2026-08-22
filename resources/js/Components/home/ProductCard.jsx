import { Link, usePage } from '@inertiajs/react';
import { Heart, Info, MinusCircleIcon, PlusCircleIcon, X } from 'lucide-react';
import {useState} from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { addItemToCart, showAlert } from '@/redux/cartSlice';

const ProductBadge = ({ text, t }) => (
  <span className={`rounded-full ${ text=== 'sale' ? 'bg-secondary' : text=== 'featured' ? 'bg-primary' : text=== 'season' ? 'bg-emerald-700' : text=== 'new' ? 'bg-yellow-600' : '' } px-3 py-1 text-xs font-semibold text-white`}>
    {t(`owl-products.${text}`)}
  </span>
);

const numberValue = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const today = new Date().toISOString().slice(0, 10);

const isDiscountActive = (priceOption) => {
  if (numberValue(priceOption?.discount_price) <= 0) {
    return false;
  }

  if (priceOption.start_date && String(priceOption.start_date).slice(0, 10) > today) {
    return false;
  }

  if (priceOption.end_date && String(priceOption.end_date).slice(0, 10) < today) {
    return false;
  }

  return true;
};

const sortedPrices = (product) => [...(product.prices || [])].sort((a, b) => numberValue(a.min_qty) - numberValue(b.min_qty));

const priceForQuantity = (product, quantity, canUseTierPrices) => {
  const prices = sortedPrices(product);

  if (!prices.length) {
    return null;
  }

  if (!canUseTierPrices) {
    return prices[0];
  }

  return prices.find((priceOption) => {
    const minQty = numberValue(priceOption.min_qty);
    const maxQty = numberValue(priceOption.max_qty);

    return quantity >= minQty && quantity <= maxQty;
  }) || prices[0];
};

const displayPrice = (priceOption) => {
  if (!priceOption) {
    return null;
  }

  if (isDiscountActive(priceOption)) {
    return {
      price: numberValue(priceOption.discount_price).toFixed(2),
      originalPrice: numberValue(priceOption.price).toFixed(2),
      discountPercentage: priceOption.discount_percentage,
    };
  }

  return {
    price: numberValue(priceOption.price).toFixed(2),
    originalPrice: null,
    discountPercentage: null,
  };
};

const QuantitySelector = ({product, lang, t, quantity, setQuantity}) => {
  return (
    <div className={`flex items-center justify-center gap-x-2 ${lang=='ar'?'font-adobe text-xl':''}`} dir={lang==='ar'?'rtl':'ltr'}>
      {['piece','pack'].includes(product.unit)
      ? (
          <div className="flex gap-x-1 items-center">
              <button
              onClick={()=>setQuantity(quantity-1)}
              disabled={quantity<1}
              >
                  <MinusCircleIcon className='text-primary w-6 h-6 hover:text-brown-800 disabled:text-gray-200 disabled:hover:text-gray-200' />
              </button>
              <p className="text-brown-800 text-lg not-italic font-medium">{quantity}</p>
              <button
              onClick={()=>setQuantity(quantity+1)}
              >
                  <PlusCircleIcon className='text-primary w-6 h-6 hover:text-brown-800 disabled:text-gray-200 disabled:hover:text-gray-200' />
              </button>
          </div>
      )
      : (
          <div className="relative inline-flex items-center">
            <input 
              type="number" 
              step={0.1}
              name="quantity" 
              id="quantity" 
              className={`block w-24 rounded-full border-0 ${lang==='ar'?'pl-8 text-lg py-0.5':'pr-8 text-base py-1'} text-gray-900 shadow-sm ring-1 ring-inset ring-primary placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-secondary`}
              value={quantity}
              onChange={(e)=>setQuantity(parseFloat(e.target.value))}
            />
            <span className={`pointer-events-none absolute ${lang==='ar'?'left-3':'right-3'} text-sm text-slate-500`}>
              {t(`product.${product.unit}`)}
            </span>
          </div>
      )}
      {['piece','pack'].includes(product.unit) && (<p className='text-brown-800/80 font-medium'> {t(`product.${product.unit}`)}</p>)}
      
  </div>
  )
}

const PriceTablePopup = ({ product, t, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
    <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{t('homepage.product.price_popup.title')}</h3>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2 pr-3 font-semibold">{t('homepage.product.price_popup.qty')}</th>
              <th className="py-2 pr-3 font-semibold">{t('homepage.product.price_popup.price')}</th>
              <th className="py-2 pr-3 font-semibold">{t('homepage.product.price_popup.discount')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedPrices(product).map((priceOption) => {
              const current = displayPrice(priceOption);

              return (
                <tr key={priceOption.id}>
                  <td className="py-2 pr-3 text-slate-700">
                    {priceOption.min_qty} - {priceOption.max_qty} {t(`product.${product.unit}`)}
                  </td>
                  <td className="py-2 pr-3 font-medium text-slate-900">
                    {current.price} {t('product.tnd')}
                    {current.originalPrice && (
                      <span className="ml-2 text-xs text-slate-400 line-through">
                        {current.originalPrice} {t('product.tnd')}
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-slate-700">
                    {current.originalPrice ? `${priceOption.discount_percentage || 0}%` : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

function ProductCard({ product }) {
  const { auth } = usePage().props;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const lang = i18n.language;
  const [quantity, setQuantity] = useState(1);
  const [showPrices, setShowPrices] = useState(false);
  const canUseTierPrices = Boolean(auth?.user?.company_id);
  const selectedPriceOption = priceForQuantity(product, quantity, canUseTierPrices);
  const currentPrice = displayPrice(selectedPriceOption);
  const hasDiscount = sortedPrices(product).some((priceOption) => isDiscountActive(priceOption));
  const hasCompanyPrices = canUseTierPrices && sortedPrices(product).length > 1;

  const addItem = (product) => {
      dispatch(addItemToCart({
        product: {
          ...product,
          selected_price_option: selectedPriceOption,
          unit_price: currentPrice?.price,
          price: currentPrice?.price,
        },
        quantity
      }));
      dispatch(showAlert({ type: 'success', message: 'cart.product-add-cart-success' }));
  };

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <div className="absolute left-4 top-4 z-10">
          <div className="flex flex-wrap items-center gap-2">
            {hasDiscount ? <ProductBadge text='sale' t={t} /> : <></>}
            {product.is_featured ? <ProductBadge text='featured' t={t} /> : <></>}
            {product.is_season ? <ProductBadge text='season' t={t} /> : <></>}
            {product.is_new ? <ProductBadge text='new' t={t} /> : <></>}
          </div>
        </div>
        <button className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-600 shadow">
          <Heart className="h-4 w-4" />
        </button>
        <Link href={'/product/'+product.url}>
          <img src={`/${product.main_image}`} alt={product.name?.[lang] ?? product.name?.en} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-64" />
        </Link>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900">{product.name?.[lang] ?? product.name?.en}</h3>
        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
          <p>{t('homepage.product.fresh_stock')} / {t(`product.${product.unit}`)}</p>
          {hasCompanyPrices && (
            <button
              type="button"
              onClick={() => setShowPrices(true)}
              title={t('homepage.product.price_popup.tooltip')}
              className="inline-flex p-1 items-center gap-x-2 justify-center rounded-full bg-green-50 text-green-700 hover:bg-green-100"
            >
              <Info className="h-4 w-4" />
              <p className="text-xs">{t('homepage.product.price_popup.label')}</p>
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xl font-bold text-green-700">
            {currentPrice ? `${currentPrice.price} ${t('product.tnd')}` : '-'}
          </span>
          {currentPrice?.originalPrice ? (
          <span className="text-sm text-slate-400 line-through">{currentPrice.originalPrice} {t('product.tnd')}</span>
          ) : null}
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <QuantitySelector product={product} lang={i18n.language} t={t} quantity={quantity} setQuantity={setQuantity}/>
          <button
            onClick={()=>addItem(product)} 
            className="w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-light sm:w-auto"
          >
            {t('owl-products.add-cart')}
          </button>
        </div>
      </div>
      {showPrices && (
        <PriceTablePopup product={product} t={t} onClose={() => setShowPrices(false)} />
      )}
    </div>
  );
}

export default ProductCard
