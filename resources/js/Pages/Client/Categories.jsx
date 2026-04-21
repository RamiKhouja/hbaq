import ClientLayout from '@/Layouts/ClientLayout';
import { Link } from '@inertiajs/react';
import React from 'react'
import { useTranslation } from 'react-i18next';

function Categories({auth, categories, eventCategories}) {
    const {t, i18n} = useTranslation();
  return (
    <ClientLayout showMain={false} user={auth?.user} categories={categories} eventCategories={eventCategories}>
      <div className='w-full my-24 px-6 lg:px-0' dir={i18n.language==='ar' ? 'rtl' : 'ltr'}>
        <h2 className="mx-auto text-3xl lg:text-5xl font-bold tracking-tight text-brown-800 mb-4">
            {t('shop.title')}
        </h2>
        <h2 className="mx-auto text-base lg:text-xl font-normal tracking-tight text-primary mb-8">
            {t('shop.subtitle')}
        </h2>
        <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-8 lg:gap-16 lg:grid-cols-4 items-center">
                {categories?.map(category => (
                <Link href={`/menu/${category.url}`} key={category.id} className='group'>
                <div className='text-center'>
                    <img src={category.image} className='w-full group-hover:shadow-sm aspect-square rounded-full object-cover shadow-xl' alt="" />
                    <p className='mt-4 lg:mt-8 text-xl md:text-3xl lg:5xl text-brown-800 cursor-pointer font-semibold group-hover:text-primary'>
                    {i18n.language === 'en' ? category?.name?.en : i18n.language === 'fr' ? category?.name?.fr : category?.name?.ar}
                    </p>
                </div>
                </Link>
                ))}
            </div>
        </div>
      </div>
    </ClientLayout>
  )
}

export default Categories