import React from 'react'
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function SectionTitle({ eyebrow, title, description, link = null }) {
  const { i18n } = useTranslation();

  return (
    <div className={`mb-8 flex flex-col gap-3 md:mb-10 md:flex-row ${link ? 'md:items-center' : 'md:items-end'} md:justify-between`}>
      <div>
        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
          {eyebrow}
        </span>
        <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl">{title}</h2>
        {link && (
          <Link href={link} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-brown-800">
            {i18n.language === 'ar' && <ArrowLeft className="h-4 w-4" />}
            <span>{i18n.language === 'ar' ? 'عرض الكل' : 'View all'}</span>
            {i18n.language !== 'ar' && <ArrowRight className="h-4 w-4" />}
          </Link>
        )}
      </div>
      <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base">{description}</p>
    </div>
  );
}

export default SectionTitle
