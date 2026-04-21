import { createContact, fetchUnreadContacts } from '@/redux/messageSlice';
import { BuildingStorefrontIcon, ClockIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

export default function Contact() {

  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const [alert, setAlert] = useState({
    open: false,
    status: '',
    message: ''
  })

  const [message, setMessage] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage({
      ...message,
      [name]: value
    });
  };

  const emptyForm = () => {
    setMessage(prevMessage => 
      Object.fromEntries(Object.keys(prevMessage).map(key => [key, '']))
    );
  }

  useEffect(()=>{
    alert.open && setTimeout(() => {
      setAlert({open: false, status: '', message: ''})
    }, "3000")
  }, [alert])
  
  const handleSubmit = () => {
    // dispatch(createContact(message));
    // emptyForm();
    // setAlert({
    //     open: true,
    //     status: 'success',
    //     message: "Message Sent Successfully!"
    // });
    axios.post('/api/contact', message)
    .then(res => {
      emptyForm();
      res.status === 201
      ? setAlert({
        open: true,
        status: 'success',
        message: "Message Sent Successfully!"
      })
      : setAlert({
        open: true,
        status: 'fail',
        message: "Something Went Wrong, please try again."
      })
    })
    .catch(err => {
      emptyForm();
      setAlert({
        open: true,
        status: 'fail',
        message: "Something Went Wrong, please try again."
      })
    });
  }

  const handleClose = () => {
    setAlert({
      open: false,
      status: '',
      message: ""
    })
  }

  return (
    <div className="relative isolate bg-transparent my-24 mx-2 sm:mx-0 lg:mx-auto lg:max-w-7xl 2xl:max-w-screen-2xl">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 lg:gap-x-8 xl:gap-x-16" dir={i18n.language==='ar'?'rtl':'ltr'}>
        <div className="relative px-6 py-12 sm:pt-16 lg:static lg:px-8 lg:py-28">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <div className={`absolute inset-y-0 ${i18n.language==='ar' ? 'right-0' : 'left-0'}  -z-10 w-full overflow-hidden ring-1 ring-brown-900/10 lg:w-1/2 bg-brown-800 rounded-3xl`}>
              <img src="/pictures/global/contact-2.jpg" className='w-full opacity-5 rounded-3xl' alt="" />
            </div>
            <h2 className="text-pretty text-4xl font-semibold tracking-tight text-white sm:text-5xl lang-ar:font-hudhud lang-ar:font-medium">
              {t('contact.get-touch')}
            </h2>
            <p className="mt-6 text-lg text-white lang-ar:text-2xl">
              {t('contact.subtitle')}            
            </p>
            <dl className="mt-10 space-y-4 text-lg lang-ar:text-2xl text-white">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Address</span>
                  <BuildingStorefrontIcon aria-hidden="true" className="h-7 w-6 text-white" />
                </dt>
                <a href="https://maps.app.goo.gl/DeWpfMCsjWTwJzRu8" className='hover:text-primary' target='_blank'>
                  <dd>
                    {t('contact.rue-jeune')}
                    <br />
                    {t('contact.menzah-tunis')}
                  </dd>
                </a>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Telephone</span>
                  <PhoneIcon aria-hidden="true" className="h-7 w-6 text-white" />
                </dt>
                <dd>
                  <a dir='ltr' href="tel:+216 70 295 544" className="hover:text-primary">
                    +216 70 295 544
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Email</span>
                  <EnvelopeIcon aria-hidden="true" className="h-7 w-6 text-white" />
                </dt>
                <dd>
                  <a href="mailto:hello@example.com" className="hover:text-primary">
                    hello@twinpeaks.tn
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-10">
                <p className="text-3xl lang-ar:font-hudhud lang-ar:font-medium font-semibold text-white">{t('contact.opening-hours')}</p>
                <div className="flex gap-x-4 mt-6 items-center">
                    <ClockIcon aria-hidden="true" className="h-7 w-7 text-white" />
                    <div className="flex gap-x-4 items-center">
                        <p className="text-lg lang-ar:text-2xl text-white font-medium">{t('contact.everyday')}</p>
                        <svg viewBox="0 0 2 2" className="w-1 flex-none fill-white/90">
                            <circle r={1} cx={1} cy={1} />
                        </svg>
                        <p className="text-lg lang-ar:text-2xl text-white font-medium">{t('contact.7am')} - {t('contact.10pm')}</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
        <form className="px-6 py-12 sm:py-16 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="first-name" className="block text-lg lang-ar:text-2xl font-semibold text-brown-800">
                  {t('contact.name')}
                </label>
                <div className="mt-2.5">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={t('contact.foulen')}
                    value={message.name}
                    onChange={handleChange}
                    autoComplete="given-name"
                    className="block w-full rounded-lg bg-white px-3.5 py-2 text-base text-brown-800 outline outline-1 -outline-offset-1 outline-brown-500 lang-ar:placeholder:text-xl placeholder:text-brown-800/70 focus:ring-1 focus:border focus:border-primary focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="last-name" className="block text-lg lang-ar:text-2xl font-semibold text-brown-800">
                {t('contact.phone')}
                </label>
                <div className="mt-2.5">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder='+216 20 123 456'
                    value={message.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    className="block w-full rounded-lg bg-white px-3.5 py-2 text-lg lang-ar:text-2xl lang-ar:text-right text-brown-800 outline outline-1 -outline-offset-1 outline-brown-500 lang-ar:placeholder:text-xl placeholder:text-brown-800/70 focus:ring-1 focus:border focus:border-primary focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-lg lang-ar:text-2xl font-semibold text-brown-800">
                {t('contact.email')}
                </label>
                <div className="mt-2.5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder='example@gmail.com'
                    value={message.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="block w-full rounded-lg bg-white px-3.5 py-2 text-base text-brown-800 outline outline-1 -outline-offset-1 outline-brown-500 lang-ar:placeholder:text-xl placeholder:text-brown-800/70 focus:ring-1 focus:border focus:border-primary focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="subject" className="block text-lg lang-ar:text-2xl font-semibold text-brown-800">
                {t('contact.subject')}
                </label>
                <div className="mt-2.5">
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder={t('contact.subject')}
                    value={message.subject}
                    onChange={handleChange}
                    className="block w-full rounded-lg bg-white px-3.5 py-2 text-base text-brown-800 outline outline-1 -outline-offset-1 outline-brown-500 lang-ar:placeholder:text-xl placeholder:text-brown-800/70 focus:ring-1 focus:border focus:border-primary focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-lg lang-ar:text-2xl font-semibold text-brown-800">
                {t('contact.message')}
                </label>
                <div className="mt-2.5">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder={t('contact.whats-mind')}
                    className="block w-full rounded-lg bg-white px-3.5 py-2 text-base text-brown-800 outline outline-1 -outline-offset-1 outline-brown-500 lang-ar:placeholder:text-xl placeholder:text-brown-800/70 focus:ring-1 focus:border focus:border-primary focus:ring-primary focus:outline-none"
                    value={message.message}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={()=>handleSubmit()}
                className="rounded-lg bg-primary px-3.5 py-2 text-center text-lg lang-ar:text-xl font-semibold text-white shadow-sm hover:bg-primary hover:text-brown-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t('contact.send')}
              </button>
            </div>
          </div>
        </form>
      </div>

      {alert.open && (
      <div className={`rounded-lg ${alert.status==='success' ? ('bg-green-100 text-green-800') : ('bg-red-100 text-red-800')}  p-4 fixed z-50 top-24 right-8 shadow-xl w-full md:w-1/2 lg:w-1/3`}>
        <div className="flex justify-between items-start">
          <div className="flex">
            <div className="shrink-0">
              {alert.status==='success'
              ? (<CheckCircleIcon aria-hidden="true" className="w-5 h-5 " />)
              : (<XCircleIcon aria-hidden="true" className="w-5 h-5 " />)
              }
            </div>
            <div className="ml-3">
              <h3 className="text-lg lang-ar:text-2xl font-medium ">{alert.message}</h3>
            </div>
          </div>
          <button onClick={()=>handleClose()}>
            <XMarkIcon className='w-5 h-5 ' />
          </button>
        </div>
      </div>
      )}
    </div>
  )
}
