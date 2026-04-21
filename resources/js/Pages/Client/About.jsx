import Banner from '@/Components/Banner'
import Contact from '@/Components/Contact'
import Team from '@/Components/Team'
import ClientLayout from '@/Layouts/ClientLayout'
import React from 'react'
import { useTranslation } from 'react-i18next'

function About({auth, about, users, categories, eventCategories}) {
  const {t, i18n} = useTranslation();
  const lang = i18n.language;
  return (
    <ClientLayout user={auth?.user} categories={categories} eventCategories={eventCategories} noLimits={true}>
    <div>
        {/* Hero Section */}
        <div className="relative isolate -z-10" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-brown-100 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" width="100%" height="100%" strokeWidth={0} />
          </svg>
          <div
            aria-hidden="true"
            className={`absolute ${lang=='ar'?'right-1/2 left-0 lg:mr-24 xl:mr-48' : 'left-1/2 right-0 lg:ml-24 xl:ml-48'} top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl`}
          >
            <div
              style={{
                clipPath:
                  'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
              }}
              className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-brown-200 to-rose-900 opacity-20 lang-ar:-translate-x-1/2"
            />
          </div>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-16 pt-16 sm:pt-28 lg:px-8 lg:pt-4">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h1 className="text-pretty leading-snug lg:leading-normal lg:-mt-48 text-2xl tracking-normal text-brown-800 sm:text-4xl lang-ar:font-hudhud">
                    {lang === 'en' ? JSON.parse(about.title)?.en : lang==='fr' ? JSON.parse(about.title)?.fr : JSON.parse(about.title)?.ar}
                  </h1>
                  <p className="mt-2 text-pretty text-lg lang-ar:text-xl font-medium text-brown-800 sm:max-w-md sm:text-xl/8 lang-ar:sm:text-3xl lg:max-w-none">
                    {lang === 'en' ? JSON.parse(about.paragraph_1)?.en : lang==='fr' ? JSON.parse(about.paragraph_1)?.fr : JSON.parse(about.paragraph_1)?.ar}
                  </p>
                </div>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <img
                        alt=""
                        src={about.picture_1 ? '/' + about.picture_1 : '/pictures/default.jpg'}
                        // src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <img
                        alt=""
                        src={about.picture_2 ? '/' + about.picture_2 : '/pictures/default.jpg'}
                        // src="https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        alt=""
                        src={about.picture_3 ? '/' + about.picture_3 : '/pictures/default.jpg'}
                        // src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <img
                        alt=""
                        src={about.picture_4 ? '/' + about.picture_4 : '/pictures/default.jpg'}
                        // src="https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=left&w=400&h=528&q=80"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        alt=""
                        src={about.picture_5 ? '/' + about.picture_5 : '/pictures/default.jpg'}
                        // src="https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl mt-20 lg:-mt-48">
                <h1 className="text-pretty leading-snug lg:leading-normal  text-2xl tracking-normal text-brown-800 sm:text-4xl lang-ar:font-hudhud">
                  {lang === 'en' ? JSON.parse(about.title_2)?.en : lang==='fr' ? JSON.parse(about.title_2)?.fr : JSON.parse(about.title_2)?.ar}
                </h1>
                <p className="mt-2 text-pretty text-lg lang-ar:text-xl font-medium text-brown-800 sm:max-w-md sm:text-xl/8 lang-ar:sm:text-3xl lg:max-w-none">
                  {lang === 'en' ? JSON.parse(about.paragraph_2)?.en : lang==='fr' ? JSON.parse(about.paragraph_2)?.fr : JSON.parse(about.paragraph_2)?.ar}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* End of Hero Section */}
        {/* <Banner /> */}
        {/* <Team users={users} /> */}
        <div className='mx-auto mb-28 sm:px-6 lg:px-8 max-w-7xl'>
            <Contact />
        </div>
    </div>
    </ClientLayout>
  )
}

export default About