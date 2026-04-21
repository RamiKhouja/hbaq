import Product from '@/Components/Product'
import ClientLayout from '@/Layouts/ClientLayout'
import { useTranslation } from 'react-i18next';

function Shop({auth, category, products, categories, eventCategories}) {
  const {t, i18n} = useTranslation();

  return (
    <ClientLayout showMain={false} user={auth?.user} categories={categories} eventCategories={eventCategories}>
      <div className='w-full my-12 px-6 lg:px-0' dir={i18n.language==='ar' ? 'rtl' : 'ltr'}>
        <div className="text-center mb-12 lang-ar:font-hudhud">
          <h2 className="mx-auto lg:text-5xl lang-ar:text-4xl lg:lang-ar:text-6xl font-bold tracking-tight text-brown-800 mb-4">
              {i18n.language === 'en' ? category?.name?.en : i18n.language === 'fr' ? category?.name?.fr : category?.name?.ar}
          </h2>
          <h2 className="mx-auto text-base lang-ar:text-xl lg:text-xl lg:lang-ar:text-3xl font-normal tracking-tight text-primary max-w-screen-sm">
              {i18n.language === 'en' ? category?.description?.en : i18n.language === 'fr' ? category?.description?.fr : category?.description?.ar}
          </h2>
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