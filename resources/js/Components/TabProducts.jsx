import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import OwlProducts from './OwlProducts';
import { useTranslation } from 'react-i18next';

function TabProducts({prodCats}) {
  const {t, i18n} = useTranslation();
  return (
    <div className='mt-16'>
        <Tabs selectedTabClassName="bg-primary rounded-t-lg">
            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-7xl lg:px-8">
              <h2 className="text-center text-2xl mx-auto lg:text-5xl font-bold tracking-tight text-gray-900 mb-8 lg:mb-16">
                  {t('owl-products.per-category')}
              </h2>
              <TabList className='border-b-2 border-b-primary flex justify-around lg:justify-start flex-wrap lg:flex-nowrap'>
                {prodCats && prodCats.map((prodCat) => (
                  <Tab key={prodCat.category.id}>
                    <div className='flex items-center gap-x-2'>
                      <img src={prodCat.category.image} className='w-6 h-6 md:w-8 md:h-8 rounded-full' alt="" />
                      <p className='text-base md:text-lg text-brown-800 cursor-pointer font-semibold'>
                        {i18n.language=== 'ar' ? prodCat.category?.name?.ar : i18n.language=== 'en' ? prodCat.category?.name?.en : prodCat.category?.name?.fr}
                      </p>
                    </div>
                  </Tab>
                ))}
              
              </TabList>
            </div>
            {prodCats && prodCats.map((prodCat) => (
                <TabPanel key={prodCat.category.id}>
                  <OwlProducts products={prodCat.products}/>
                </TabPanel>
            ))}
        </Tabs>
    </div>
  )
}

export default TabProducts