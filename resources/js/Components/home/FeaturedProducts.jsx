import React from 'react'
import SectionTitle from './SectionTitle'
import ProductCard from './ProductCard'
import { useTranslation } from 'react-i18next';

function FeaturedProducts({featured}) {
  const { t } = useTranslation();
  return (
    <section id="products" className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
            eyebrow={t('homepage.featured.eyebrow')}
            title={t('homepage.featured.title')}
            description={t('homepage.featured.description')}
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured?.map((product) => (
            <ProductCard key={product.id} product={product} />
            ))}
        </div>
        </div>
    </section>
  )
}

export default FeaturedProducts
