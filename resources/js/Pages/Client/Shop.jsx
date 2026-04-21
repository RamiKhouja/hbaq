import Product from '@/Components/Product'
import ClientLayout from '@/Layouts/ClientLayout'
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function Shop({auth, prodCats, categories, selectedCat, eventCategories}) {
  const {t, i18n} = useTranslation();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  useEffect(() => {
    if (selectedCat && prodCats) {
      const index = prodCats.findIndex(prodCat => prodCat.category.id === parseInt(selectedCat));
      setSelectedTabIndex(index >= 0 ? index : 0);
    }
  }, [selectedCat, prodCats]);

  return (
    <ClientLayout showMain={false} user={auth?.user} categories={categories} eventCategories={eventCategories}>
      <div className='w-full my-24 px-6 lg:px-0' dir={i18n.language==='ar' ? 'rtl' : 'ltr'}>
        <h2 className="mx-auto text-3xl lg:text-5xl font-bold tracking-tight text-brown-800 mb-4">
            {t('shop.title')}
        </h2>
        <h2 className="mx-auto text-base lg:text-xl font-normal tracking-tight text-primary mb-8">
            {t('shop.subtitle')}
        </h2>
        <Tabs 
          selectedTabClassName="bg-primary rounded-t-lg"
          selectedIndex={selectedTabIndex}
          onSelect={(index) => setSelectedTabIndex(index)}
        >
            <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
              
              <TabList className='border-b-2 border-b-primary flex justify-around lg:justify-start flex-wrap lg:flex-nowrap' >
                {prodCats && prodCats.map((prodCat) => (
                  <Tab key={prodCat.category.id}>
                    <div className='flex items-center gap-x-2'>
                      <img src={prodCat.category.image} className='w-6 h-6 md:w-8 md:h-8 rounded-full' alt="" />
                      <p className='text-base md:text-lg text-brown-800 cursor-pointer font-semibold'>
                        {i18n.language === 'en' ? prodCat.category?.name?.en : i18n.language === 'fr' ? prodCat.category?.name?.fr : prodCat.category?.name?.ar}
                      </p>
                    </div>
                  </Tab>
                ))}
              
              </TabList>
            </div>
            
            {prodCats && prodCats.map((prodCat) => (
                <TabPanel key={prodCat.category.id}>
                  <div className="w-full grid lg:grid-cols-4 gap-8">
                    {prodCat.products?.map(product => (
                      <Product product={product} key={product.id}/>
                    ))}
                  </div>
                </TabPanel>
            ))}
        </Tabs>
      </div>
      
      
    </ClientLayout>
  )
}

export default Shop