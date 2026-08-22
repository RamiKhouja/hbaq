import ProductCard from '@/Components/home/ProductCard'
import ShopFilter from '@/Components/ShopFilter'
import ClientLayout from '@/Layouts/ClientLayout'
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';

function Shop({auth, products, categories, filterCategories, eventCategories}) {
  const {t, i18n} = useTranslation();
  const [filterOpen, setFilterOpen] = useState(false);
  const [desktopFilterOpen, setDesktopFilterOpen] = useState(true);
  const productList = products?.data || [];
  const productGridClasses = desktopFilterOpen
    ? 'grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-8'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-8';

  const paginationLabel = (label) => {
    if (label.includes('Previous')) {
      return i18n.language === 'ar' ? 'السابق' : i18n.language === 'fr' ? 'Precedent' : 'Previous';
    }

    if (label.includes('Next')) {
      return i18n.language === 'ar' ? 'التالي' : i18n.language === 'fr' ? 'Suivant' : 'Next';
    }

    return label;
  };

  return (
    <ClientLayout showMain={false} user={auth?.user} categories={categories} eventCategories={eventCategories}>
      <div className='w-full my-24 px-6 lg:px-0' dir={i18n.language==='ar' ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-brown-800 mb-4">
            {t('shop.title')}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setFilterOpen(!filterOpen)}
              className="sm:hidden inline-flex items-center gap-x-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              {t('shop.filter')}
            </button>
            <button
              type="button"
              onClick={() => setDesktopFilterOpen(!desktopFilterOpen)}
              className="hidden sm:inline-flex items-center gap-x-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              {t('shop.filter')}
            </button>
          </div>

          {filterOpen && (
            <div className="sm:hidden mb-8">
              <ShopFilter categories={filterCategories} setOpen={setFilterOpen} />
            </div>
          )}

          <div className={`grid gap-8 ${desktopFilterOpen ? 'sm:grid-cols-[280px_minmax(0,1fr)]' : 'sm:grid-cols-1'}`}>
            <div className={`${desktopFilterOpen ? 'hidden sm:block' : 'hidden'}`}>
              <ShopFilter categories={filterCategories} />
            </div>
            <div>
              {productList.length > 0 ? (
                <div className={productGridClasses}>
                  {productList.map(product => (
                    <ProductCard product={product} key={product.id}/>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-gray-200 bg-white py-16 text-center text-brown-800 font-semibold">
                  {i18n.language === 'ar' ? 'لا توجد منتجات مطابقة' : i18n.language === 'fr' ? 'Aucun produit trouve' : 'No matching products found'}
                </div>
              )}

              {products?.links?.length > 3 && (
                <div className="mt-12 grid grid-flow-col auto-cols-max items-center justify-center gap-2 overflow-x-auto">
                  {products.links.map((link, index) => (
                    link.url ? (
                      <Link
                        key={`${link.label}-${index}`}
                        href={link.url}
                        preserveScroll
                        className={`min-w-10 rounded-md px-3 py-2 text-center text-sm font-semibold ring-1 ring-inset ${
                          link.active
                            ? 'bg-primary text-white ring-primary'
                            : 'bg-white text-primary ring-primary hover:bg-brown-800 hover:text-white'
                        }`}
                      >
                        {paginationLabel(link.label)}
                      </Link>
                    ) : (
                      <span
                        key={`${link.label}-${index}`}
                        className="min-w-10 rounded-md px-3 py-2 text-center text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-200"
                      >
                        {paginationLabel(link.label)}
                      </span>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}

export default Shop
