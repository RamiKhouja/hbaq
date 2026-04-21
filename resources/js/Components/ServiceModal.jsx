import { Dialog, Transition } from '@headlessui/react';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
import { BanknotesIcon } from '@heroicons/react/24/solid';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

function ServiceModal({open, setOpen, user, id}) {
  const {t, i18n} = useTranslation();
  const lang=i18n.language;
  const [services, setServices] = useState([]);
  const [step, setStep] = useState(1);
  const [total, setTotal] = useState(0.000);
  const [isValid, setIsValid] = useState(false);
  // const [isPurchaseValid, setIsPurchaseValid] = useState(false);

  const paymentMethods = [
    { id: 'credit-card', title: t('consultation.credit-card') },
    // { id: 'bank', title: t('consultation.bank-transfer') },
    { id: 'cash', title: t('consultation.pay-cash') },
  ]

  // const [cardInfo, setCardInfo] = useState({
  //   cardNumber: '',
  //   cardName: '',
  //   expDate: '',
  //   cvc: ''
  // });

  // const handleChangeCard = (e) => {
  //   const { name, value } = e.target;
  //   setCardInfo({
  //     ...cardInfo,
  //     [name]: value,
  //   });
  // }

  // const handleInputChange = (e) => {
  //   const input = e.target.value.replace(/\s+/g, ''); // Remove existing spaces
  //   const formattedInput = input.replace(/(\d{4})(?=\d)/g, '$1 '); // Add space every 4 digits
  //   setCardInfo({
  //     ...cardInfo,
  //     cardNumber: formattedInput
  //   });
  // };

  // const handleExpChange = (e) => {
  //   const input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
  //   const formattedInput = input
  //     .slice(0, 4) // Limit to 4 digits (MMYY)
  //     .replace(/(\d{2})(\d{1,2})/, '$1/$2'); // Add '/' after 2 digits
  //     setCardInfo({
  //       ...cardInfo,
  //       expDate: formattedInput
  //     });
  // };

  const [selectedPayment, setSelectedPayment] = useState('credit-card');

  // useEffect(()=>{
  //   setIsPurchaseValid(
  //     selectedPayment === 'bank' || selectedPayment === 'cash' || 
  //     (selectedPayment === 'credit-card' && cardInfo.cardName && cardInfo.cardNumber && cardInfo.expDate && cardInfo.cvc)
  //   )
  // }, [selectedPayment, cardInfo])

  const [request, setRequest] = useState({
    first_name: user?.firstname,
    last_name: user?.lastname,
    email: user?.email,
    phone: user?.phone,
    message: "",
    date: "",
    total: 0,
    nb_persons: 0,
    status: 'pending',
    payment_method: selectedPayment,
    services: []
  });

  const handleCardPay = async (request) =>  {
    const data = {
      "receiverWalletId": "65626489757f299608eb5265",
      //"receiverWalletId": "65622c4c1d81aef420ee5e93", //sandbox
      "token": "TND",
      "amount": request.total*1000,
      "type": "immediate",
      "description": "payment description",
      "acceptedPaymentMethods": [
        "bank_card"
      ],
      "lifespan": 20,
      "checkoutForm": false,
      "addPaymentFeesToAmount": false,
      "firstName": request.first_name??'',
      "lastName": request.last_name??'',
      "phoneNumber": request.phone,
      "email": request.email,
      "orderId": request.id.toString(),
      "webhook": "https://merchant.tech/api/notification_payment",
      "silentWebhook": true,
      "successUrl": `http://localhost:8000/api/request-payment-response/${request.id}`,
      "failUrl": `http://localhost:8000/api/request-payment-response/${request.id}`,
      //"failUrl": "https://gateway.konnect.network/payment-failure",
      "theme": "light"
    }
    axios.post("https://api.konnect.network/api/v2/payments/init-payment", data, {
      headers: {
        'x-api-key': '65626489757f299608eb525f:UrkKzvLwuFiOS2lfbHysCckZRsJ5D8cK'
        //'x-api-key': '65622c4c1d81aef420ee5e8f:PX3zr7Y1atwGJuJ0fXvV' // sandbox
      }
    }).then(res => {
      //setPaymentRef(res.data.paymentRef);
      window.location.assign(res.data.payUrl);
    })
    }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequest({
      ...request,
      [name]: value,
    });
  };

  function truncateString(inputString, maxWords) {
    const words = inputString.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + ' ...';
    } else {
      return inputString;
    }
  }

  const handleCheckboxChange = (index) => {
    setServices((prevServices) => {
      return prevServices.map((service, i) =>
        i === index
          ? { ...service, selected: !service.selected }
          : service
      );
    });
  };

  useEffect(()=>{
    const selectedServices = services.filter(service => service.selected);
    const selectedIds = selectedServices.map(service => service.id);
    let amount = 0.000;
    //selectedServices.map(service => {amount= parseFloat(service.price) + parseFloat(amount)});
    setTotal(amount);
    setRequest({
      ...request,
      services: selectedIds,
      total: amount
    });
  
  },[services])

  useEffect(()=>{
    setRequest({
      ...request,
      payment_method: selectedPayment
    });
  },[selectedPayment])

  useEffect(()=>{
    setIsValid(request.date && request.email && request.first_name && request.phone && request.services?.length>0);
  }, [request])

  const handleSubmit = () => {
    axios.post('/api/requests', request)
    .then(res => {
      router.visit(`/service/request/${res.data.id}?success=true`);
      // if(selectedPayment === 'credit-card') {
      //   handleCardPay(res.data);
      // } 
      // // else if(selectedPayment === 'bank') {
      // //   setStep(4);
      // // } 
      // else if(selectedPayment === 'cash') {
      //   //setStep(4);
      //   router.visit(`/service/request/${res.data.id}?success=true`);
      // }
      setOpen(false);
      //setStep(1);
    })
    .catch(err => console.log(err));
  }

  const terminate = () => {
    setRequest({
      first_name: user?.firstname,
      last_name: user?.lastname,
      email: user?.email,
      phone: user?.phone,
      message: "",
      date: "",
      total: 0,
      status: 'pending',
      services: []
    });
    // setCardInfo({
    //   cardNumber: '',
    //   cardName: '',
    //   expDate: '',
    //   cvc: ''
    // })
    setSelectedPayment('credit-card');
    setOpen(false);
    setStep(1);
  }

  const getServices = () => {
    axios.get('http://localhost:8000/api/services')
    .then(res => {
      const updatedServices = res.data.map(service => ({
        ...service,
        selected: id ? service.id == id ? true : false : false
      }));
      setServices(updatedServices);
    })
    .catch(err => console.log(err));
  }
  useEffect(()=>{
    getServices();
  },[id])
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-primary bg-opacity-90 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-5xl  sm:p-6 lg:p-12 font-noto" dir={lang==='ar' ? ('rtl') : ('ltr')}>
                
                {step === 1
                ? (
                <>
                  <div className='mb-8'>
                    <p className="text-3xl text-brown-800 font-semibold">{t('consultation.title')}</p>
                    <p className='text-base text-gray-500'>{t('consultation.subtitle')}</p>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-4">
                    <div className="gap-y-5">
                    {services?.map((service, index) => (
                      <div className="flex gap-3" key={index}>
                        <input
                          id={`service-${index}`}
                          name="service"
                          type="checkbox"
                          checked={service.selected}
                          onChange={() => handleCheckboxChange(index)}
                          aria-describedby="comments-description"
                          className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-brown-600 checked:bg-primary indeterminate:border-brown-600 indeterminate:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                        />
                        <div className={`text-sm/6 ${lang=='ar' ? 'text-right': 'text-left'}`}>
                          <label htmlFor={`service-${index}`} className="font-medium text-gray-900">
                            {lang=== 'en' ? service.name?.en : lang==="fr" ? service.name?.fr : service.name?.ar}
                          </label>
                          <p id="comments-description" className="text-gray-500">
                            {truncateString(lang=== 'en' ? service.description?.en : lang==="fr" ? service.description?.fr : service.description?.ar, 5)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3">
                      <div className='sm:col-span-2'>
                        <label htmlFor="email" className={`block text-sm/6 font-medium text-gray-900 ${lang=='ar' ? 'text-right': 'text-left'}`}>
                        {t('consultation.date')}
                        </label>
                        <div className="mt-2">
                          <input
                            id="date"
                            name="date"
                            type="date"
                            value={request.date}
                            onChange={handleChange}
                            className="block w-full sm:w-1/2 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-brown-600 sm:text-sm/6"
                          />
                        </div>
                      </div>
                      <div className='col-span-1'>
                        <label htmlFor="last-name" className={`block text-sm/6 font-semibold text-brown-800 ${lang=='ar' ? 'text-right': 'text-left'}`}>
                        {t('request.nb_persons')}
                        </label>
                        <div className="mt-1">
                          <input
                            id="nb_persons"
                            name="nb_persons"
                            type="number"
                            value={request.nb_persons}
                            onChange={handleChange}
                            className="block w-20 rounded-md bg-white px-3.5 py-1 text-base text-brown-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                      <div>
                        <label htmlFor="first-name" className={`block text-sm/6 font-semibold text-brown-800 ${lang=='ar' ? 'text-right': 'text-left'}`}>
                        {t('consultation.firstname')}
                        </label>
                        <div className="mt-1">
                          <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            value={request.first_name}
                            onChange={handleChange}
                            autoComplete="given-name"
                            className="block w-full rounded-md bg-white px-3.5 py-1 text-base text-brown-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="last-name" className={`block text-sm/6 font-semibold text-brown-800 ${lang=='ar' ? 'text-right': 'text-left'}`}>
                        {t('consultation.lastname')}
                        </label>
                        <div className="mt-1">
                          <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            value={request.last_name}
                            onChange={handleChange}
                            autoComplete="family-name"
                            className="block w-full rounded-md bg-white px-3.5 py-1 text-base text-brown-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-primary"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="email" className={`block text-sm/6 font-semibold text-brown-800 ${lang=='ar' ? 'text-right': 'text-left'}`}>
                        {t('consultation.email')}
                        </label>
                        <div className="mt-1">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={request.email}
                            onChange={handleChange}
                            autoComplete="email"
                            className="block w-full rounded-md bg-white px-3.5 py-1 text-base text-brown-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-primary"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="phone-number" className={`block text-sm/6 font-semibold text-brown-800 ${lang=='ar' ? 'text-right': 'text-left'}`}>
                        {t('consultation.phone')}
                        </label>
                        <div className="mt-1">
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={request.phone}
                            onChange={handleChange}
                            autoComplete="tel"
                            className="block w-full rounded-md bg-white px-3.5 py-1 text-base text-brown-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-primary"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="message" className={`block text-sm/6 font-semibold text-brown-800 ${lang=='ar' ? 'text-right': 'text-left'}`}>
                        {t('consultation.message')}
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="message"
                            name="message"
                            value={request.message}
                            onChange={handleChange}
                            rows={4}
                            className="block w-full rounded-md bg-white px-3.5 py-1 text-base text-brown-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-primary"
                            
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 flex justify-end gap-x-4">
                  <button
                    type="button"
                    className="inline-flex w-fit justify-center rounded-lg bg-white border border-primary text-primary px-3 py-1.5 text-sm font-semibold shadow-sm hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    onClick={() => setOpen(false)}
                  >
                    {t('consultation.cancel')}
                  </button>
                  <button
                      type="button"
                      // disabled={!isPurchaseValid}
                      className="inline-flex w-fit justify-center gap-x-2 items-center rounded-lg bg-primary border border-primary disabled:bg-gray-400 disabled:border-gray-400 px-3 py-1.5 text-sm font-semibold text-brown-800 disabled:text-white shadow-sm hover:bg-primary hover:border-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      onClick={() => handleSubmit()}
                    >
                      {/* <BanknotesIcon className='w-5 h-5' /> */}
                      {t('consultation.confirm')}
                      {/* {selectedPayment === 'credit-card' ? t('consultation.purchase') : t('consultation.confirm')} */}
                  </button>
                  {/* <button
                    type="button"
                    disabled={!isValid}
                    className="inline-flex w-fit justify-center gap-x-2 items-center rounded-lg bg-primary border border-primary disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-default px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary hover:border-primary hover:text-brown-800 disabled:hover:bg-gray-400 disabled:hover:border-gray-400 disabled:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    onClick={() => setStep(2)}
                  >
                    {t('consultation.next')}
                    {lang === 'ar'
                    ? (<ChevronDoubleLeftIcon className='w-4 h-4' />)
                    : (<ChevronDoubleRightIcon className='w-4 h-4' />)
                    }
                  </button> */}
                </div>
                </>
                ): step === 2 ?(
                  <>
                  <div className='mb-8'>
                    <p className={`text-3xl text-brown-800 font-semibold ${lang==='ar' ? 'text-right' : 'text-left'}`}>{t('consultation.summary')}</p>
                    <p className={`text-base text-gray-500 ${lang==='ar' ? 'text-right' : 'text-left'}`}>{t('consultation.summary-subtitle')}</p>
                  </div>
                  <div className='grid lg:grid-cols-2 gap-8 mt-6'>
                    <div>
                        {services?.filter(serice => serice.selected)?.map(service => (
                          <div className='flex justify-between items-center mb-4' key={service.id}>
                            <p className='text-brown-800'>{lang=== 'en' ? service.name?.en : lang==="fr" ? service.name?.fr : service.name?.ar}</p>
                            {/* <p className='text-brown-800'>{parseFloat(service.price)} {t('consultation.tnd')}</p> */}
                          </div>
                        ))}
                        <div className='flex justify-between items-center mt-8 border-t border-t-primary pt-6'>
                          <p className='text-brown-800 font-bold'>{t('consultation.total')}</p>
                          <p className='text-brown-800 font-bold'>{total} {t('consultation.tnd')}</p>
                        </div>
                    </div>
                    <div className='flex justify-center w-full'>
                      <div className='border-2 border-primary border-dashed rounded-xl w-fit h-fit p-4'>
                        <p className='text-primary'>{request?.first_name} {request?.last_name}</p>
                        <p className='text-primary'>{request?.email}</p>
                        <p className='text-primary'>{request?.phone}</p>
                        <p className='text-brown-800 mt-1 text-right'>{request?.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 flex justify-end gap-x-4">
                    <button
                      type="button"
                      className="inline-flex w-fit justify-center gap-x-2 items-center rounded-lg bg-white border border-primary text-primary px-3 py-1.5 text-sm font-semibold shadow-sm hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      onClick={() => setStep(1)}
                    >
                      {lang === 'ar'
                    ? (<ChevronDoubleRightIcon className='w-4 h-4' />)
                    : (<ChevronDoubleLeftIcon className='w-4 h-4' />)
                    }
                      {t('consultation.previous')}
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-fit justify-center gap-x-2 items-center rounded-lg bg-primary border border-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary hover:border-primary hover:text-brown-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      onClick={() => setStep(3)}
                    >
                      {t('consultation.validate')}
                      {lang === 'ar'
                      ? (<ChevronDoubleLeftIcon className='w-4 h-4' />)
                      : (<ChevronDoubleRightIcon className='w-4 h-4' />)
                      }
                    </button>
                  </div>
                  </>
                ): step === 3 ? (
                  <>
                  <div className='mb-8'>
                    <p className={`text-3xl text-brown-800 font-semibold ${lang==='ar' ? 'text-right' : 'text-left'}`}>{t('consultation.payment-section')}</p>
                    <p className={`text-base text-gray-500 ${lang==='ar' ? 'text-right' : 'text-left'}`}>{t('consultation.payment-subtitle')}</p>
                  </div>
                  <div className="mt-10">
                    <h2 className={`text-lg font-medium text-gray-900 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t('consultation.payment-method')}</h2>

                    <fieldset className="mt-4">
                      <legend className="sr-only">Payment type</legend>
                      <div className="gap-y-4 sm:flex sm:items-center sm:gap-x-10 sm:gap-y-0">
                        {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
                          <div key={paymentMethod.id} className="flex items-center gap-x-3">
                            <input
                              defaultChecked={paymentMethodIdx === 0}
                              id={paymentMethod.id}
                              name="payment-type"
                              type="radio"
                              onChange={()=>setSelectedPayment(paymentMethod.id)}
                              className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-brown-600 checked:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                            />
                            <label htmlFor={paymentMethod.id} className="block text-sm/6 font-medium text-gray-700">
                              {paymentMethod.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                    {/* {selectedPayment === 'credit-card' && (
                    <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-4 lg:w-1/2">
                      <div className="col-span-4">
                        <label htmlFor="card-number" className={`block text-sm/6 font-medium text-gray-700 ${lang==='ar' ? 'text-right' : 'text-left'}`}>
                        {t('consultation.card-number')}
                        </label>
                        <div className="mt-1">
                          <input
                            id="card-number"
                            name="cardNumber"
                            type="text"
                            maxLength="19"
                            placeholder='xxxx xxxx xxxx xxxx'
                            value={cardInfo.cardNumber}
                            onChange={handleInputChange}
                            autoComplete="cc-number"
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-brown-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="col-span-4">
                        <label htmlFor="name-on-card" className={`block text-sm/6 font-medium text-gray-700 ${lang==='ar' ? 'text-right' : 'text-left'}`}>
                        {t('consultation.name-on-card')}
                        </label>
                        <div className="mt-1">
                          <input
                            id="name-on-card"
                            name="cardName"
                            type="text"
                            placeholder={t('consultation.foulen')}
                            value={cardInfo.cardName}
                            onChange={handleChangeCard}
                            autoComplete="cc-name"
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-brown-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="col-span-3">
                        <label htmlFor="expiration-date" className={`block text-sm/6 font-medium text-gray-700 ${lang==='ar' ? 'text-right' : 'text-left'}`}>
                        {t('consultation.expiration')}
                        </label>
                        <div className="mt-1">
                          <input
                            id="expiration-date"
                            name="expDate"
                            type="text"
                            maxLength="5"
                            placeholder={t('consultation.mmyy')}
                            value={cardInfo.expDate}
                            onChange={handleExpChange}
                            autoComplete="cc-exp"
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-brown-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cvc" className={`block text-sm/6 font-medium text-gray-700 ${lang==='ar' ? 'text-right' : 'text-left'}`}>
                        {t('consultation.cvc')}
                        </label>
                        <div className="mt-1">
                          <input
                            id="cvc"
                            name="cvc"
                            type="text"
                            placeholder='123'
                            value={cardInfo.cvc}
                            onChange={handleChangeCard}
                            autoComplete="csc"
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-brown-600 sm:text-sm/6"
                          />
                        </div>
                      </div>
                    </div>
                    )} */}
                  </div>
                  <div className="mt-5 sm:mt-6 flex justify-end gap-x-4">
                    <button
                      type="button"
                      className="inline-flex w-fit justify-center gap-x-2 items-center rounded-lg bg-white border border-primary text-primary px-3 py-1.5 text-sm font-semibold shadow-sm hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      onClick={() => setStep(2)}
                    >
                      {lang === 'ar'
                    ? (<ChevronDoubleRightIcon className='w-4 h-4' />)
                    : (<ChevronDoubleLeftIcon className='w-4 h-4' />)
                    }
                      {t('consultation.previous')}
                    </button>
                    <button
                      type="button"
                      // disabled={!isPurchaseValid}
                      className="inline-flex w-fit justify-center gap-x-2 items-center rounded-lg bg-primary border border-primary disabled:bg-gray-400 disabled:border-gray-400 px-3 py-1.5 text-sm font-semibold text-brown-800 disabled:text-white shadow-sm hover:bg-primary hover:border-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      onClick={() => handleSubmit()}
                    >
                      <BanknotesIcon className='w-5 h-5' />
                      {selectedPayment === 'credit-card' ? t('consultation.purchase') : t('consultation.confirm')}
                    </button>
                  </div>
                  </>
                ): (
                  <>
                  <div className='text-center p-8'>
                    {selectedPayment === 'bank'
                    ? (<p>This is the bank account number</p>)
                    : selectedPayment === 'cash'
                      ? (<p>Congratulations</p>)
                      : (<p>Credit card success</p>)
                    }
                  </div>
                  <div className="mt-5 sm:mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex w-fit rounded-lg bg-primary border border-primary disabled:bg-gray-400 disabled:border-gray-400 px-3 py-1.5 text-sm font-semibold text-brown-800 disabled:text-white shadow-sm hover:bg-primary hover:border-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      onClick={() => terminate()}
                    >
                      {t('consultation.terminate')}
                    </button>
                  </div>
                  </>
                )}
                
                
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ServiceModal