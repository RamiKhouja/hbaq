import Product from '@/Components/Product'
import ClientLayout from '@/Layouts/ClientLayout'
import { useTranslation } from 'react-i18next';

function Shop({auth, category, products, categories, eventCategories}) {
  const {t, i18n} = useTranslation();

  return (
    <ClientLayout showMain={false} user={auth?.user} categories={categories} eventCategories={eventCategories}>
      <div className='w-full px-6 lg:px-0 mb-12' dir={i18n.language==='ar' ? 'rtl' : 'ltr'}>
        <div className="relative mb-24">
          <div className="w-full h-fit bg-white">
            <img src={'/'+category.image} className='w-full h-44 lg:h-72 aspect-square object-cover opacity-50 mx-auto' alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
          </div>
          <div className="absolute top-1/2 lg:left-1/2 lg:-translate-x-1/2 text-center px-4 lg:px-0">
            <h2 className="mx-auto drop-shadow-2xl home-section-title">
                {i18n.language === 'en' ? category?.name?.en : i18n.language === 'fr' ? category?.name?.fr : category?.name?.ar}
            </h2>
            <h2 className="mx-auto drop-shadow-2xl home-section-description max-w-screen-sm">
                {i18n.language === 'en' ? category?.description?.en : i18n.language === 'fr' ? category?.description?.fr : category?.description?.ar}
            </h2>
          </div>
        </div>
        <div className="w-full grid lg:grid-cols-5 2xl:grid-cols-6 gap-8">
          {products?.map(product => (
            <Product product={product} key={product.id}/>
          ))}
        </div>
      </div>
      
      
    </ClientLayout>
  )
}

export default Shop