import React from 'react'
import { ShoppingCartIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';
import { addItemToCart, showAlert } from '@/redux/cartSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { HeartIcon, MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/20/solid';
import { addItemToLiked } from '@/redux/likedSlice';

function Product({product}) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang = localStorage.getItem('lang');
    const [quantity, setQuantity] = useState(1);

    const addItem = (product) => {
        dispatch(addItemToCart({ product, quantity }));
        dispatch(showAlert({ type: 'success', message: 'cart.product-add-cart-success' }));
    };

    const addToLiked = (product) => {
        dispatch(addItemToLiked({ product, quantity }));
        dispatch(showAlert({ type: 'success', message: 'liked.product-add-liked-success' }));
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
    <div className='flex flex-col justify-between h-full items-stretch'>
        <div className="group relative">
            <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-gray-200 group-hover:shadow-lg lg:h-40 xl:h-44">
                <img
                src={'/'+product.main_image}
                alt={product.name.en}
                className="h-full w-full object-cover object-center relative"
                />
                <div className='absolute top-4 right-4 flex gap-x-2 items-center'>
                {product.is_new==1 && (
                    <div className="bg-red-700 rounded-full p-2">
                        <p className='text-white font-bold text-sm'>{t('owl-products.new')}</p>
                    </div>
                )}
                </div>
                <div className='absolute top-4 right-4 flex gap-x-2 items-center'>
                {product.is_discount === 1 && (
                    <div className="bg-lime-800 rounded-xl px-2 py-0.5 shadow-lg">
                        <p className={`text-white font-semibold ${lang === 'ar' ? 'text-xl font-adobe': 'text-base'}`}>{t('owl-products.sale')}</p>
                    </div>
                )}
                </div>
            </div>
            <div className="mt-4 flex justify-between px-1" dir={lang==='ar'?'rtl':'ltr'}>
                <div className='w-full text-center'>
                    <h3 className={`text-primary mb-1.5 ${lang==='ar' ? 'text-3xl font-adobe font-medium' : 'text-lg font-semibold'}`}>
                        <Link href={'/product/'+product.url} title={lang==='ar' ? product.name.ar : lang==='en' ? product.name.en : product.name.fr}>
                        <span className="absolute inset-0" />
                        {lang==='ar' ? truncateString(product.name.ar,5) : lang==='en' ? truncateString(product.name.en,5) : truncateString(product.name.fr,5)}
                        </Link>
                    </h3>
                    {product.is_discount
                    ? (
                    <h3 className={`text-primary font-bold ${lang==='ar' ? 'font-adobe text-xl' : 'text-sm'}`}>
                        <span className={`relative text-brown-800 font-medium mx-2 ${lang==='ar' ? 'font-adobe text-xl' : 'text-sm'}`}> 
                            <span className="absolute left-0 top-1/2 w-full h-[1px] bg-brown-800 rotate-[-15deg]"></span>
                            {parseFloat(product.price)} {t('product.tnd')}
                        </span>
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
                    {/* <p className="mt-2 text-sm text-gray-700 font-semibold">{t('product.ingredients')} :</p>
                    <p className="text-sm text-gray-700">{lang==='ar' ? product.description.ar : lang==='en' ? product.description.en : product.description.fr}</p> */}
                </div>
            </div>
        </div>
        <div className={`flex mt-4 items-center justify-center gap-x-2 ${lang=='ar'?'font-adobe text-xl':''}`} dir={lang==='ar'?'rtl':'ltr'}>
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
                <input 
                    type="number" 
                    step={0.1}
                    name="quantity" 
                    id="quantity" 
                    className="block w-16 rounded-lg border-0 py-0.5 text-gray-900 shadow-sm ring-1 ring-inset ring-primary placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-brown-600"
                    value={quantity}
                    onChange={(e)=>setQuantity(parseFloat(e.target.value))}
                />
            )}
            {product.unit !== 'pack' && (<p className='text-brown-800/80 font-medium'> {t(`product.${product.unit}`)}</p>)}
            {/* {['kg','100-grams'].includes(product.unit)
            ? (
                <select 
                    defaultValue={product.unit} 
                    defaultChecked={product.unit}
                    className='w-fit rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600'
                    onChange={(e)=>setUnit(e.target.value)}
                >
                    <option value={'100-grams'}>{t('product.100-grams')}</option>
                    <option value={'kg'}>{t('product.kg')}</option>
                </select>
            )
            : (
                <p className='text-brown-800/80 font-medium'> {t(`product.${product.unit}`)}</p>
            )} */}
        </div>
        <div className="flex lang-ar:flex-row-reverse items-center gap-x-2 w-full h-fits mt-4 justify-center">
        <button
            type="button"
            dir={lang==='ar'?'rtl':'ltr'}
            onClick={()=>addItem(product)}
            className="inline-flex justify-center w-fit items-center gap-x-4 rounded-full bg-primary px-6 py-2 lang-ar:py-1.5 text-sm lang-ar:text-lg font-semibold text-white shadow-sm hover:bg-brown-300 hover:text-brown-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
            <ShoppingCartIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            {t('owl-products.add-cart')}
        </button>
        <button 
            type='button' 
            onClick={()=>addToLiked(product)}
            className='rounded-full group border border-primary p-1.5 text-center text-primary hover:bg-brown-300 hover:border-brown-300 hover:text-brown-800'
        >
            <HeartIcon className='w-5 h-5 group-hover:hidden' />
            <SolidHeartIcon className='w-5 h-5 hidden group-hover:block' />
        </button>   
        </div>
        
    </div>
  )
}

export default Product