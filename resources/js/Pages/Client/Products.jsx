import ProductCard from '@/Components/home/ProductCard';
import SectionTitle from '@/Components/home/SectionTitle';
import Product from '@/Components/Product'
import ClientLayout from '@/Layouts/ClientLayout'
import { useTranslation } from 'react-i18next';

function Shop({auth, category, products, categories, eventCategories}) {
  const {t, i18n} = useTranslation();

  return (
    <ClientLayout showMain={false} user={auth?.user} categories={categories} eventCategories={eventCategories}>
      <div className='w-full my-12 px-6 lg:px-0' dir={i18n.language==='ar' ? 'rtl' : 'ltr'}>
        <SectionTitle
          eyebrow={t('homepage.categories.eyebrow')}
          title={category.name?.[i18n.language] ?? category.name?.en}
          description={category.description?.[i18n.language] ?? category.description?.en ?? t('homepage.categories.description')}
        />
        <div className="mt-8 w-full grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
          {products?.map(product => (
            // <Product product={product} key={product.id}/>
            <ProductCard product={product} key={product.id}/>
          ))}
        </div>
      </div>
      
      
    </ClientLayout>
  )
}

export default Shop