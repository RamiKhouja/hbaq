import { Fragment, useState, usePage, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon, MinusCircleIcon, PlusCircleIcon, ShoppingCartIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, router } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { clearCart, removeItemFromCart, updateQuantity } from '@/redux/cartSlice'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'

export default function Cart({open,setOpen, cart}) {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);

  const normalize = (value) => Math.round((Number(value) + Number.EPSILON) * 10) / 10;
  const handleUpdateQuantity = (product, quantity) => {
    if(quantity>0) {
      dispatch(updateQuantity({ productId: product.id, quantity: normalize(quantity) }));
    }
  };

  const handleRemoveItem = (product) => {
    dispatch(removeItemFromCart(product.id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const calculateTotal = () => {
    let subtotal = 0;
    cart.map(item => {
      subtotal+= item.product.is_discount ? item.product.price_after_discount * item.quantity : item.product.price * item.quantity;
    })
    setTotal(subtotal);
  }

  useEffect(()=>{
    calculateTotal();
  }, [cart])

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-brown-800 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className={`flex h-full flex-col bg-white shadow-xl ${lang=='ar'?'font-adobe':'font-nanum'}`}>
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6" dir={lang=='ar'?'rtl':'ltr'}>
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="flex items-center gap-x-4">
                          <ShoppingCartIcon className='text-brown-800 w-8 h-8' />
                          <p className={`${lang==='ar'?'text-xl lg:text-3xl' : 'text-lg lg:text-xl'} font-semibold text-brown-800`}>{t('cart.shopping-cart')}</p>
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      {/* <div className="mt-6">
                      <button 
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                          onClick={()=>deleteAll()}
                      >
                          Empty Cart
                      </button>
                      </div> */}
                      <div className="mt-8">
                      {cart && cart.length>0 
                      ? (
                      <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {cart.map((item) => (
                              <li key={item.product.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200">
                                  <img
                                   
                                    src={'/'+item.product.main_image}
                                    alt={item.product.name.en}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="mx-4 flex flex-1 flex-col">
                                  <div>
                                    <div className={`flex justify-between items-center ${lang==='ar' ? 'text-2xl font-medium' : 'text-base font-semibold'} text-brown-800`}>
                                      <h3>
                                 
                                        <a href={`/product/${item.product.url}`}>
                                          {lang=='ar' ? item.product.name.ar : lang=='en' ? item.product.name.en : item.product.name.fr}
                                        </a>
                                      </h3>
                                      <p className={`text-base text-brown-900 ${lang==='ar'?'lg:text-3xl font-semibold':'lg:text-lg font-bold'}`}>
                                        {item.product.is_discount ? item.product.price_after_discount * item.quantity : item.product.price * item.quantity} {t('cart.tnd')}
                                      </p>
                                    </div>
                                    {item.product.is_discount
                                    ? (
                                      <h3 className={`text-primary font-semibold my-2 ${lang==='ar' ? 'font-adobe text-xl' : 'text-sm'}`}>
                                          {parseFloat(item.product.price_after_discount)} {t('product.tnd')}
                                          {item.product.unit !== 'pack' && (<span className='text-brown-800 font-medium'> ({t(`product.${item.product.unit}`)})</span>)}
                                          <span className={`text-brown-800 font-medium line-through mx-2 ${lang==='ar' ? 'font-adobe text-lg' : 'text-xs'}`}> {parseFloat(item.product.price)} {t('product.tnd')}</span>
                                      </h3>
                                    )
                                    : (
                                      <h3 className={`text-brown-800 font-bold my-2 ${lang==='ar' ? 'font-adobe text-xl' : 'text-sm'}`}>
                                          {parseFloat(item.product.price)} {t('product.tnd')}
                                          {item.product.unit !== 'pack' && (<span className='text-brown-800 font-medium'> ({t(`product.${item.product.unit}`)})</span>)}
                                      </h3>
                                    )}
                                    
                                    {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    {['piece','pack'].includes(item.product.unit)
                                    ? (
                                        <div className="flex gap-x-1 items-center">
                                          <button
                                            onClick={()=>handleUpdateQuantity(item.product, item.quantity-1)}
                                            disabled={item.quantity<2}
                                          >
                                              <MinusCircleIcon className='text-primary w-8 h-8 hover:text-brown-800 disabled:text-gray-200 disabled:hover:text-gray-200' />
                                          </button>
                                          <p className={`text-brown-800 ${lang=='ar' ? 'text-2xl' : 'text-lg'} not-italic font-medium`}>{item.quantity}</p>
                                          <button
                                            onClick={()=>handleUpdateQuantity(item.product, item.quantity+1)}
                                          >
                                              <PlusCircleIcon className='text-primary w-8 h-8 hover:text-brown-800 disabled:text-gray-200 disabled:hover:text-gray-200' />
                                          </button>
                                        </div>  
                                    )
                                    : (
                                      <div className="flex items-center gap-x-1">
                                        <input 
                                            type="number" 
                                            step={0.1}
                                            min={0.1}
                                            name="quantity" 
                                            id="quantity" 
                                            className="block w-16 mx-1 rounded-lg border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-primary placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-brown-600"
                                            value={item.quantity}
                                            onChange={(e)=>handleUpdateQuantity(item.product, parseFloat(e.target.value))}
                                        />
                                        <div className='flex flex-col gap-y-0.5'>
                                          <button type='button' onClick={()=>handleUpdateQuantity(item.product, item.quantity+0.1)}>
                                            <ChevronUpIcon className='text-brown-800 w-4 h-4' />
                                          </button>
                                          <button type='button' onClick={()=>handleUpdateQuantity(item.product, item.quantity-0.1)}>
                                            <ChevronDownIcon className='text-brown-800 w-4 h-4' />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                    <button
                                        type="button"
                                       onClick={()=>{handleRemoveItem(item.product)}}
                                      >
                                        <TrashIcon className='text-gray-600 w-5 h-5' />
                                      </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        )
                        : (
                          <div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
                            <div className='flex flex-col justify-center items-center'>
                              <img src="/pictures/global/empty-bag.png" className='h-28' alt="" />
                              <p className="mt-8 text-xl text-brown-800 font-semibold italic lang-ar:text-3xl lang-ar:font-medium">{t('cart.nothing-in-bag')}</p>
                            </div>
                          </div>
                        )
                        }
                      </div>
                    </div>
                    {cart && cart.length>0 && (
                    <div className='pt-4'>
                      <button 
                        onClick={handleClearCart}
                        className="mb-4 ml-6 flex items-center gap-x-2 text-primary hover:text-brown-800"
                      >
                          <TrashIcon className='w-4 h-4' />
                          <p className={lang=='ar'?'text-lg':'text-sm'}>{t('cart.empty-cart')}</p>
                      </button>
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6" dir={lang=='ar'?'rtl':'ltr'}>
                        <div className="flex justify-between text-brown-800">
                          <p className='text-xl font-medium'>{t('cart.total')}</p>
                          <p className='text-xl font-semibold'>{total} {t('cart.tnd')}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">{t('cart.ship-calc')}</p>
                        <div className="mt-6">
                          <Link
                            disabled={cart.length===0}
                            href="/checkout"
                            className={`flex items-center justify-center w-full rounded-full border border-transparent bg-primary px-6 py-1 ${lang==='ar' ? 'text-2xl font-medium' : 'text-lg font-semibold' } text-white shadow hover:bg-brown-600 hover:text-white disabled:bg-gray-400`}
                          >
                            {t('cart.checkout')}
                          </Link>
                        </div>
                      </div>
                    </div>       
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
                            
}
