import { addItemToCart, showAlert } from '@/redux/cartSlice';
import { removeItemFromLiked } from '@/redux/likedSlice';
import { ShoppingCartIcon } from '@heroicons/react/20/solid';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

function ProductItem({ product }) {
  const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const lang = i18n.language;

    const addItem = (product) => {
        dispatch(addItemToCart({ product, quantity:1 }));
        dispatch(showAlert({ type: 'success', message: 'cart.product-add-cart-success' }));
    };

    const removeFromLiked = (product) => {
        dispatch(removeItemFromLiked({ product }));
        dispatch(showAlert({ type: 'success', message: 'liked.product-remove-liked-success' }));
    };


    function truncateString(inputString, maxWords) {
        const words = inputString.split(' ');
        if (words.length > maxWords) {
          return words.slice(0, maxWords).join(' ') + '...';
        } else {
          return inputString;
        }
    }

  return (
    <div className='flex items-start justify-between w-full' dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-x-4">
            <Link href={'/product/'+product.url}>
                <img
                    src={'/'+product.main_image}
                    alt={product.name.en}
                    className="h-16 w-16 lg:w-20 lg:h-20 object-cover rounded-xl"
                />
            </Link>
            <div>
                <Link href={'/product/'+product.url} className={`text-primary mb-1.5 ${lang==='ar' ? 'text-3xl font-adobe font-medium' : 'text-lg font-semibold'}`}>
                    {lang==='ar' ? truncateString(product.name.ar,5) : lang==='en' ? truncateString(product.name.en,5) : truncateString(product.name.fr,5)}
                </Link>
                <div className="flex items-center gap-x-8 justify-between mt-2">
                    {product.is_discount
                    ? (
                    <h3 className={`text-brown-800 font-bold ${lang==='ar' ? 'font-adobe text-xl' : 'text-sm'}`}>
                        {parseFloat(product.price_after_discount)} {t('product.tnd')}
                        {product.unit !== 'pack' && (<span className='text-brown-800/80 font-medium'> ({t(`product.${product.unit}`)})</span>)}
                    </h3>
                    )
                    : (
                        <h3 className={`text-brown-800 font-bold ${lang==='ar' ? 'font-adobe text-xl' : 'text-sm'}`}>
                        {parseFloat(product.price)} {t('product.tnd')}
                        {product.unit !== 'pack' && (<span className='text-brown-800/80 font-medium'> ({t(`product.${product.unit}`)})</span>)}
                    </h3>
                    )}
                    <button 
                        className='text-primary hover:text-brown-500' 
                        title={t('owl-products.add-cart')}
                        onClick={()=>addItem(product)}
                    >
                        <ShoppingCartIcon className='w-5 h-5'/>
                    </button>
                </div>
            </div>
        </div>
        <button onClick={()=>removeFromLiked(product)}>
            <XCircleIcon className='w-5 h-5 text-gray-600 z-40' />  
        </button>
    </div>
  )
}

export default ProductItem;