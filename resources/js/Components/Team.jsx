import React from 'react'
import { useTranslation } from 'react-i18next'

function Team({users}) {
  const { t, i18n } = useTranslation()
  return (
    <div className="mx-auto mt-32 max-w-7xl px-6 sm:my-16 lg:px-8" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-2xl lg:mx-0">
        <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">{t('about.our-team')}</h2>
        <p className="mt-6 text-lg/8 text-gray-600">
            {t('about.team-subtitle')}
        </p>
        </div>
        <ul
        role="list"
        className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 text-center sm:grid-cols-2 md:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-4 xl:grid-cols-5"
        >
        {users?.map((person) => (
            <li key={person.id}>
            <img 
              alt={person.firstname} 
              src={person.picture ? `/${person.picture}` : '/pictures/user.jpg'} 
              className="mx-auto w-28 h-28 object-cover rounded-full" 
            />
            <h3 className="mt-6 text-base/7 font-semibold tracking-tight text-gray-900">{person.firstname}</h3>
            <p className="text-sm/6 text-gray-600">{t(`about.${person.role}`)}</p>
            </li>
        ))}
        </ul>
    </div>
  )
}

export default Team