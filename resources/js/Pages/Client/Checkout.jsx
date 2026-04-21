
import { Fragment, useEffect, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import ClientLayout from '@/Layouts/ClientLayout'
import { useTranslation } from 'react-i18next'
import { router, usePage } from '@inertiajs/react';
import { useDispatch, useSelector } from 'react-redux'
import { MinusCircleIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline'
import { clearCart, removeItemFromCart, updateQuantity } from '@/redux/cartSlice'
import { ChevronDownIcon, ChevronUpIcon, BanknotesIcon, CreditCardIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { createOrder } from '@/redux/orderSlice'


export default function Checkout({auth, user, categories, eventCategories}) {
  const {i18n, t} = useTranslation();
  const { env } = usePage().props;
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const lang= i18n.language;
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [isDelivery, setIsDelivery] = useState(true)
  const [deliveryCost, setDeliveryCost] = useState(5)
  const [cutlery, setCutlery] = useState(true);
  const [firstname, setFirstname] = useState(user?.firstname);
  const [lastname, setLastname] = useState(user?.lastname);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(user?.phone);
  const [address1, setAddress1] = useState(user?.address);
  const [address2, setAddress2] = useState(user?.address_2);
  const [city, setCity] = useState(user?.city);
  const [state, setState] = useState(user?.state || "Tunis");
  const [zip, setZip] = useState(user?.zip);
  const [message, setMessage] = useState();
  const [paymentRef, setPaymentRef] = useState();

  //console.log(env.APP_URL)

  // const [profileId, setProfileId] = useState(null);
  // const [orderId, setOrderId] = useState(null);

  const confirm =()=>{
    router.post('/cart/checkout')
  }

  const [contactValid, setContactValid] = useState(false);
  const [addressValid, setAddressValid] = useState(false);

  useEffect(() => {
    const isEmailValid = /^\S+@\S+\.\S+$/.test(email || "");
    const isValidTNPhone = (value = "") => /^(?:\+216|00216)?\s?\d{8}$/.test(value.replace(/\s+/g, ""));
    setContactValid(
      Boolean(firstname?.trim() && isEmailValid && isValidTNPhone(phone))
    );
  }, [firstname, email, phone]);

  useEffect(() => {
    if(!isDelivery){
      setAddressValid(contactValid);
    } else {
      setAddressValid(Boolean(contactValid && address1?.trim() && city?.trim()))
    }
  }, [contactValid, address1, city, isDelivery])

  const normalize = (value) => Math.round((Number(value) + Number.EPSILON) * 10) / 10;

  const handleUpdateQuantity = (product, quantity) => {
    dispatch(updateQuantity({ productId: product.id, quantity: normalize(quantity) }));
  };

  const handleRemoveItem = (product) => {
    dispatch(removeItemFromCart(product.id));
  };

  const calculateSubTotal = () => {
    let subtotal = 0;
    cart.map(item => {
      subtotal+= item.product.is_discount ? item.product.price_after_discount * item.quantity : item.product.price * item.quantity;
    })
    setSubTotal(subtotal);
  }

  const calculateTotal = () => {
    if(isDelivery) 
      setTotal(subTotal+deliveryCost)
    else
      setTotal(subTotal)
  }

  useEffect(()=>{
    calculateSubTotal();
  }, [cart])

  useEffect(()=> {
    calculateTotal();
  },[subTotal, deliveryCost])

  const handleDelivery = (state) => {
    setIsDelivery(state)
    state ? setDeliveryCost(5) : setDeliveryCost(0);
  }

  const handleCardPay = async () =>  {
    let orderResult = await createNewOrder('credit-card');
    if (createOrder.fulfilled.match(orderResult)) {
      const orderId = orderResult.payload;
      const data = {
        "receiverWalletId": "65626489757f299608eb5265",
        //"receiverWalletId": "65622c4c1d81aef420ee5e93", //sandbox
        "token": "TND",
        "amount": total*1000,
        "type": "immediate",
        "description": "payment description",
        "acceptedPaymentMethods": [
          "bank_card"
        ],
        "lifespan": 20,
        "checkoutForm": false,
        "addPaymentFeesToAmount": false,
        "firstName": firstname,
        "lastName": lastname??'',
        "phoneNumber": phone,
        "email": email,
        "orderId": orderId.toString(),
        "webhook": "https://merchant.tech/api/notification_payment",
        "silentWebhook": true,
        "successUrl": `http://localhost:8000/api/payment-response/${orderId}`,
        "failUrl": `http://localhost:8000/api/payment-response/${orderId}`,
        //"failUrl": "https://gateway.konnect.network/payment-failure",
        "theme": "light"
      }
      axios.post("https://api.konnect.network/api/v2/payments/init-payment", data, {
        headers: {
          'x-api-key': '65626489757f299608eb525f:UrkKzvLwuFiOS2lfbHysCckZRsJ5D8cK'
          //'x-api-key': '65622c4c1d81aef420ee5e8f:PX3zr7Y1atwGJuJ0fXvV' // sandbox
        }
      }).then(res => {
        setPaymentRef(res.data.paymentRef);
        window.location.assign(res.data.payUrl);
      })

    } else {
      return orderResult.payload;
    }
  }

  const createProfile = async () => {
    const profile = {
      "firstname": firstname,
      "lastname": lastname,
      "email": email,
      "phone": phone,
      "state": state,
      "city": city,
      "zip": zip,
      "address": address1 + ' ' + address2
    }

    try {
      const res = await axios.post('/api/profiles', profile);
      console.log(res.data);
      return res.data?.profile?.id || null;  
    } catch (err) {
      console.log(err);
      return null; 
    }
  }

  const createNewOrder = async (payment_method) => {
    let profId= null;
    if(!user) 
      profId = await createProfile();
    const order = {
      'status': 'pending',
      'subTotal': subTotal,
      'total': total,
      'user_id': user ? user.id : null,
      'purchases': cart, 
      'delivery': deliveryCost,
      'message': message,
      'cutlery': cutlery,
      'deliveryman_id': null,
      'profile_id': user ? null : profId,
      'payment_method': payment_method,
      'shipping_method': isDelivery ? 'delivery' : 'store'
    }

    return dispatch(createOrder(order));
  }

  const payCash = async () => {
    let orderResult = await createNewOrder('cash');
    if (createOrder.fulfilled.match(orderResult)) {
      dispatch(clearCart());
      const orderId = orderResult.payload;
      window.location.href = `/order/${orderId}?success=true`;
    }
    
  }

  return (
    <ClientLayout user={auth?.user} categories={categories} eventCategories={eventCategories}>
    <div dir={lang==='ar'?'rtl':'ltr'}>
      {/* Background color split screen for large screens */}
      {/* <div className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block" aria-hidden="true" />
      <div className="fixed right-0 top-0 hidden h-full w-1/2 bg-gray-50 lg:block" aria-hidden="true" /> */}

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
        <h1 className="sr-only">Order information</h1>

        <section
          aria-labelledby="summary-heading"
          className="px-4 pt-12 sm:pt-0 pb-10 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <h2 id="summary-heading" className="text-lg lg:text-2xl lang-ar:lg:text-4xl font-medium text-gray-900">
              {t('checkout.order-sum')}
            </h2>

            <ul role="list" className="divide-y divide-brown-300 text-sm lang-ar:text-xl font-semibold  lang-ar:font-medium text-gray-900">
              {cart?.map((item) => (
                <li key={item.product.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                  <img
                   
                    src={'/'+item.product.main_image}
                    alt={item.product.name.en}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="mx-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between items-center text-base lang-ar:text-2xl lg:text-lg lang-ar:lg:text-3xl font-semibold lang-ar:font-medium text-brown-800">
                      <h3>
                 
                        <a href={`/product/${item.product.url}`} target='_blank'>
                          {lang=='ar' ? item.product.name.ar : item.product.name.en}
                        </a>
                      </h3>
                      <p className={`text-base lang-ar:text-2xl text-brown-900 ${lang==='ar'?'lg:text-3xl font-semibold':'lg:text-lg lang-ar:lg:text-3xl font-bold'}`}>
                        {item.product.is_discount ? parseFloat(item.product.price_after_discount * item.quantity) : parseFloat(item.product.price * item.quantity)} {t('checkout.tnd')}
                      </p>
                    </div>
                    {item.product.is_discount
                    ? (
                      <h3 className={`text-primary font-semibold my-2 ${lang==='ar' ? 'font-adobe text-xl' : 'text-sm lang-ar:text-xl'}`}>
                          {parseFloat(item.product.price_after_discount)} {t('product.tnd')}
                          {item.product.unit !== 'pack' && (<span className='text-brown-800 font-medium'> ({t(`product.${item.product.unit}`)})</span>)}
                          <span className={`relative text-brown-800 font-medium mx-2 ${lang==='ar' ? 'font-adobe text-xl' : 'text-sm'}`}>
                            <span className="absolute left-0 top-1/2 w-full h-[1px] bg-brown-800 rotate-[-15deg]"></span>
                            {parseFloat(item.product.price)} {t('product.tnd')}
                          </span>
                      </h3>
                    )
                    : (
                      <h3 className={`text-brown-800 font-bold my-2 ${lang==='ar' ? 'font-adobe text-xl' : 'text-sm lang-ar:text-xl'}`}>
                          {parseFloat(item.product.price)} {t('product.tnd')}
                          {item.product.unit !== 'pack' && (<span className='text-brown-800 font-medium'> ({t(`product.${item.product.unit}`)})</span>)}
                      </h3>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
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
                              onChange={(e)=>handleUpdateQuantity(item.product, e.target.value)}
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
                        <TrashIcon className='text-brown-700 w-5 h-5' />
                      </button>
                  </div>
                </div>
              </li>
              ))}
            </ul>

            <dl className="hidden space-y-6 border-t border-brown-300 pt-6 text-sm lang-ar:text-xl font-semibold  lang-ar:font-medium text-gray-900 lg:block">
              <div className="flex items-center justify-between">
                <dt className="text-brown-800">{t('checkout.subtotal')}</dt>
                <dd>{subTotal} {t('checkout.tnd')}</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-brown-800">{t('checkout.shipping')}</dt>
                <dd>{deliveryCost} {t('checkout.tnd')}</dd>
              </div>

              <div className="flex items-center justify-between border-t border-brown-300 pt-6">
                <dt className="text-base lang-ar:text-2xl">{t('checkout.total')}</dt>
                <dd className="text-base lang-ar:text-2xl">{total} {t('checkout.tnd')}</dd>
              </div>
              <div className="flex gap-x-8">
                <button 
                  disabled={!addressValid}
                  className="inline-flex items-center gap-x-2 bg-primary border border-primary hover:bg-brown-800 text-white font-bold py-1 px-4 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={()=>payCash()}
                >
                  <BanknotesIcon className='w-5 h-5' />
                  {t('checkout.cash-on-delivery')}
                </button>
                <button 
                  disabled={!addressValid}
                  className="inline-flex items-center gap-x-2 bg-white border border-primary hover:bg-primary hover:border-primary hover:text-white text-primary font-bold py-1 px-4 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={()=>handleCardPay()}
                >
                  <CreditCardIcon className='w-5 h-5' />
                {t('checkout.pay-credit-card')}
                </button>
              </div>
            </dl>

            <Popover className="fixed inset-x-0 bottom-0 flex flex-col-reverse text-sm lang-ar:text-xl font-semibold  lang-ar:font-medium text-gray-900 lg:hidden z-50">
              <div className="relative z-10 border-t border-brown-300 bg-white px-4 sm:px-6">
                <div className="mx-auto max-w-lg">
                  <Popover.Button className="flex w-full items-center py-6 font-medium">
                    <span className="mr-auto text-base lang-ar:text-2xl">{t('checkout.total')}</span>
                    <span className="mr-2 text-base lang-ar:text-2xl">{total} {t('checkout.tnd')}</span>
                    <ChevronUpIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>

              <Transition.Root as={Fragment}>
                <div>
                  <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Popover.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                  >
                    <Popover.Panel className="relative bg-white px-4 py-6 sm:px-6">
                      <dl className="mx-auto max-w-lg space-y-6">
                        <div className="flex items-center justify-between">
                          <dt className="text-gray-600">{t('checkout.subtotal')}</dt>
                          <dd>{subTotal} {t('checkout.tnd')}</dd>
                        </div>

                        <div className="flex items-center justify-between">
                          <dt className="text-gray-600">{t('checkout.shipping')}</dt>
                          <dd>{deliveryCost} {t('checkout.tnd')}</dd>
                        </div>
                      </dl>
                    </Popover.Panel>
                  </Transition.Child>
                </div>
              </Transition.Root>
            </Popover>
          </div>
        </section>

        <form className="px-4  pb-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0">
          <div className="mx-auto max-w-lg lg:max-w-none">
            <section aria-labelledby="contact-info-heading">
              <h2 id="contact-info-heading" className="text-lg lg:text-xl lang-ar:lg:text-4xl font-medium text-gray-900">
              {t('checkout.contact-info')}
              </h2>
              <div className="mt-6 grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email-address" className="block text-sm lang-ar:text-xl font-semibold  lang-ar:font-medium text-brown-800">
                  {t('checkout.firstname')} *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="firstname"
                      required
                      name="firstname"
                      placeholder={t('checkout.foulen')}
                      value = {firstname}
                      onChange={(e)=>setFirstname(e.target.value)}
                      autoComplete="firstname"
                      className="block w-full rounded-md border-brown-500 shadow-sm bg-white focus:border-primary focus:ring-primary sm:text-sm lang-ar:text-xl placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastname" className="block text-sm lang-ar:text-xl font-semibold  lang-ar:font-medium text-brown-800">
                  {t('checkout.lastname')}
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      placeholder={t('checkout.ben-foulen')}
                      value = {lastname}
                      onChange={(e)=>setLastname(e.target.value)}
                      autoComplete="lastname"
                      className="block w-full rounded-md border-brown-500 shadow-sm bg-white focus:border-primary focus:ring-primary sm:text-sm lang-ar:text-xl placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="email-address" className="block text-sm lang-ar:text-xl font-semibold  lang-ar:font-medium text-brown-800">
                {t('checkout.email')} *
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email-address"
                    required
                    name="email-address"
                    placeholder='email@example.com'
                    value = {email}
                    onChange={(e)=>setEmail(e.target.value)}
                    autoComplete="email"
                    className="block w-full rounded-md border-brown-500 shadow-sm bg-white focus:border-primary focus:ring-primary sm:text-sm lang-ar:text-xl placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="email-address" className="block text-sm lang-ar:text-xl font-semibold  lang-ar:font-medium text-brown-800">
                {t('checkout.phone')} *
                </label>
                <div className="mt-1">
                  <input
                    dir='ltr'
                    type="text"
                    id="phone"
                    name="phone"
                    required
                    value = {phone}
                    onChange={(e)=>setPhone(e.target.value)}
                    placeholder='+216 12 345 678'
                    className={`block ${lang==='ar' ? 'text-right' : 'text-left'} w-full rounded-md bg-white border-brown-500 placeholder:text-gray-400 shadow-sm focus:border-primary focus:ring-primary sm:text-sm lang-ar:text-xl`}
                  />
                </div>
              </div>

              <div className="mt-8 space-y-6 sm:flex sm:items-center sm:gap-x-10 sm:space-y-0">
                  <div className="flex items-center gap-x-3">
                    <input
                      id="store"
                      name="delivery"
                      type="radio"
                      onChange={()=>handleDelivery(false)}
                      className="relative size-4 appearance-none rounded-full border border-brown-500 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-primary checked:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:border-brown-500 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                    />
                    <label htmlFor={"store"} className="block text-sm lang-ar:text-xl/6 font-medium text-gray-900">
                    {t('checkout.store-pickup')}
                    </label>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      defaultChecked
                      id="delivery"
                      name="delivery"
                      type="radio"
                      onChange={()=>handleDelivery(true)}
                      className="relative size-4 appearance-none rounded-full border border-brown-500 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-primary checked:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:border-brown-500 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                    />
                    <label htmlFor={"delivery"} className="block text-sm lang-ar:text-2xl font-medium text-gray-900">
                    {t('checkout.delivery')} <span className='font-light text-brown-800 text-sm lang-ar:text-base'>({t('checkout.grand-tunis')})</span>
                    </label>
                  </div>
              </div>
            </section>

            {isDelivery && (
            <section aria-labelledby="shipping-heading" className="mt-10">
              <h2 id="shipping-heading" className="text-lg lg:text-xl lang-ar:lg:text-4xl font-medium text-gray-900">
              {t('checkout.shipping-address')}
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">

                <div className="sm:col-span-3">
                  <label htmlFor="address" className="block text-sm lang-ar:text-xl font-semibold  lang-ar:font-medium text-brown-800">
                  {t('checkout.address')} *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      autoComplete="street-address"
                      value = {address1}
                      onChange={(e)=>setAddress1(e.target.value)}
                      placeholder={t('checkout.street-name')}
                      className="block w-full rounded-md border-brown-500 shadow-sm bg-white focus:border-primary focus:ring-primary sm:text-sm lang-ar:text-xl placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="apartment" className="block text-sm lang-ar:text-xl font-semibold  lang-ar:font-medium text-brown-800">
                  {t('checkout.appt-suite')}
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      value = {address2}
                      onChange={(e)=>setAddress2(e.target.value)}
                      placeholder={t('checkout.apt1')}
                      className="block w-full rounded-md border-brown-500 shadow-sm bg-white focus:border-primary focus:ring-primary sm:text-sm lang-ar:text-xl placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm lang-ar:text-xl font-semibold  lang-ar:font-medium text-brown-800">
                  {t('checkout.city')} *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={city}
                      onChange={(e)=>setCity(e.target.value)}
                      placeholder={t('checkout.city-name')}
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-brown-500 shadow-sm bg-white focus:border-primary focus:ring-primary sm:text-sm lang-ar:text-xl placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="region" className="block text-sm lang-ar:text-xl font-semibold  lang-ar:font-medium text-brown-800">
                  {t('checkout.state')}
                  </label>
                  <div className="mt-1 grid grid-cols-1">
                    <select
                      id="region"
                      name="region"
                      defaultValue="Tunis"
                      value={state}
                      onChange={(e)=>setState(e.target.value)}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-brown-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm lang-ar:text-xl"
                    >
                      <option value={"Tunis"}>{t('checkout.tunis')}</option>
                      <option value={"Ariana"}>{t('checkout.ariana')}</option>
                      <option value={"Ben Arous"}>{t('checkout.ben-arous')}</option>
                      <option value={"Mannouba"}>{t('checkout.mannouba')}</option>
                    </select>
                  </div>
                  {/* <div className="mt-1">
                    <input
                      type="text"
                      id="region"
                      name="region"
                      value = {user?.addresses[0]?.state }

                      autoComplete="address-level1"
                      className="block w-full rounded-md border-brown-500 shadow-sm bg-white focus:border-primary focus:ring-primary sm:text-sm lang-ar:text-xl"
                    />
                  </div> */}
                </div>

                <div>
                  <label htmlFor="postal-code" className="block text-sm lang-ar:text-xl font-semibold  lang-ar:font-medium text-brown-800">
                  {t('checkout.zip')}
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="postal-code"
                      name="postal-code"
                      autoComplete="postal-code"
                      value={zip}
                      onChange={(e)=>setZip(e.target.value)}
                      placeholder='1001'
                      className="block w-full rounded-md border-brown-500 shadow-sm bg-white focus:border-primary focus:ring-primary sm:text-sm lang-ar:text-xl placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </section>
            )}
           
            <section aria-labelledby="shipping-heading" className="mt-10">
              <h2 id="shipping-heading" className="text-lg lg:text-xl lang-ar:lg:text-4xl font-medium text-gray-900">
              {t('checkout.more-options')}
              </h2>
              <div className="flex gap-3 mt-2">
                <div className="flex h-6 shrink-0 items-center">
                  <div className="group grid size-4 grid-cols-1">
                    <input
                      id="cutlery"
                      name="cutlery"
                      type="checkbox"
                      checked={cutlery}
                      onChange={()=>setCutlery(!cutlery)}
                      className="col-start-1 row-start-1 appearance-none rounded border border-brown-500 bg-white checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:border-brown-500 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                    />
                  </div>
                </div>
                <div className="text-sm lang-ar:text-xl/6">
                  <label htmlFor="comments" className="font-medium text-gray-900">
                    {t('checkout.need-cutlery')}
                  </label>
                </div>
              </div>
              <div className='mt-4'>
                <label htmlFor="comment" className="block text-sm lang-ar:text-xl/6 font-medium text-gray-900">
                {t('checkout.any-comments')}
                </label>
                <div className="mt-2">
                  <textarea
                    id="comment"
                    name="comment"
                    placeholder={t('checkout.dont-hesitate-comment')}
                    rows={4}
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    className="block w-full rounded-md px-3 py-1.5 text-base bg-white lang-ar:text-xl text-gray-900 outline-primary placeholder:text-gray-500 focus:outline-none sm:text-sm"
                    defaultValue={''}
                  />
                </div>
              </div>
            </section>
          </div>
        </form>
        <div className="flex flex-col gap-y-6 px-4 sm:px-10 md:max-w-lg md:w-full md:mx-auto md:px-0 items-center lg:hidden">
          <button 
            disabled={!addressValid}
            className="inline-flex items-center gap-x-2 justify-center bg-primary border border-primary hover:bg-brown-800 text-white font-bold py-2 w-full rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={()=>payCash()}
          >
            <BanknotesIcon className='w-5 h-5' />
            {t('checkout.cash-on-delivery')}
          </button>
          <button 
            disabled={!addressValid}
            className="inline-flex items-center gap-x-2 justify-center bg-white border border-primary hover:bg-primary hover:border-primary hover:text-white text-primary font-bold py-2 w-full rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={()=>{router.get('/orders')}}
          >
            <CreditCardIcon className='w-5 h-5' />
          {t('checkout.pay-credit-card')}
          </button>
        </div>
      </div>
    </div>
    </ClientLayout>
  )
}
