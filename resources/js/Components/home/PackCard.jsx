import { Gift, MinusCircle, Package, PlusCircle, ShoppingCart } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { addItemToCart, showAlert } from '@/redux/cartSlice';

const numberValue = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function PackCard({ pack }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const lang = i18n.language;
  const [quantity, setQuantity] = useState(1);
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

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          {hasDiscount && <Badge label="Sale" className="bg-secondary" />}
          {pack.is_featured && <Badge label="Featured" className="bg-primary" />}
          {pack.is_new && <Badge label="New" className="bg-yellow-600" />}
        </div>
        <Link href={`/gift-packs/${pack.url}`}>
          <img
            src={`/${pack.main_image}`}
            alt={pack.name?.[lang] || pack.name?.en}
            className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/gift-packs/${pack.url}`} className="text-lg font-semibold text-slate-900 transition hover:text-green-700">
              {pack.name?.[lang] || pack.name?.en}
            </Link>
            <p className="mt-1 text-sm text-slate-500">
              {pack.products?.length || 0} products / {pack.weight} kg
            </p>
          </div>
          <div className="rounded-full bg-green-50 p-2 text-green-700">
            <Gift className="h-5 w-5" />
          </div>
        </div>

        {pack.description?.[lang] || pack.description?.en ? (
          <p className="mt-3 line-clamp-2 text-sm text-slate-600">{pack.description?.[lang] || pack.description?.en}</p>
        ) : null}

        {/* {pack.products?.length > 0 && (
          <div className="mt-4 space-y-2">
            {pack.products.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center gap-2 text-sm text-slate-600">
                <Package className="h-4 w-4 text-slate-400" />
                <span className="truncate">{product.name?.[lang] || product.name?.en}</span>
                {product.pivot?.quantity ? <span className="text-slate-400">x{product.pivot.quantity}</span> : null}
                {product.pivot?.weight ? <span className="text-slate-400">{product.pivot.weight} kg</span> : null}
              </div>
            ))}
          </div>
        )} */}

        {pack.pictures?.length > 0 && (
          <div className="mt-4 flex gap-2">
            {pack.pictures.slice(0, 4).map((picture) => (
              <img
                key={picture.id}
                src={`/${picture.path}`}
                alt={pack.name?.[lang] || pack.name?.en}
                className="h-12 w-12 rounded-md object-cover"
              />
            ))}
          </div>
        )}

        <div>
          <div className='my-5 '>
            <span className="text-xl font-bold text-green-700">{price} {t('product.tnd')}</span>
            {hasDiscount && <span className="ml-2 text-sm text-slate-400 line-through">{originalPrice} {t('product.tnd')}</span>}
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="text-primary transition hover:text-brown-800 disabled:text-slate-300"
                aria-label="Decrease pack quantity"
              >
                <MinusCircle className="h-5 w-5" />
              </button>
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                className="h-7 w-10 border-0 bg-transparent p-0 text-center text-sm font-semibold text-brown-800 focus:ring-0"
                aria-label="Pack quantity"
              />
              <button
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
                className="text-primary transition hover:text-brown-800"
                aria-label="Increase pack quantity"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
            <button
              type="button"
              onClick={addPack}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-sm transition hover:bg-brown-700"
              title={t('owl-products.add-cart')}
              aria-label={t('owl-products.add-cart')}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ label, className }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${className}`}>
      {label}
    </span>
  );
}
