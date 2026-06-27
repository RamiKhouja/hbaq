import React from 'react'
import SectionTitle from './SectionTitle'
import ProductCard from './ProductCard'
import { useTranslation } from 'react-i18next';

function FeaturedProducts({featured, products, type = 'featured'}) {
  const { t } = useTranslation();
  const productList = products || featured || [];
  const sectionKey = `homepage.${type}`;

  if (!productList.length) {
    return null;
  }

  return (
    <section id="products" className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl xl:max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
            eyebrow={t(`${sectionKey}.eyebrow`)}
            title={t(`${sectionKey}.title`)}
            description={t(`${sectionKey}.description`)}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productList.map((product) => (
            <ProductCard key={product.id} product={product} />
            ))}
        </div>
        </div>
    </section>
  )
}

export default FeaturedProducts
