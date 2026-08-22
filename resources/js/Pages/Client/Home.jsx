import React from 'react';
import ClientLayout from '@/Layouts/ClientLayout';
import TopBanner from '@/Components/home/TopBanner';
import StatsBanner from '@/Components/home/StatsBanner';
import Categories from '@/Components/home/Categories';
import FeaturedProducts from '@/Components/home/FeaturedProducts';
import Wholesale from '@/Components/home/Wholesale';
import Deals from '@/Components/home/Deals';
import GiftPacks from '@/Components/home/GiftPacks';
import About from '@/Components/home/About';
import Testimonials from '@/Components/home/Testimonials';
import Newsletter from '@/Components/home/Newsletter';
import { useTranslation } from 'react-i18next';

export default function Home({auth, categories, featured, seasonal, packs, about, testimonials}) {
  const {i18n} = useTranslation();
  
  return (
    <ClientLayout showMain={true} user={auth.user} categories={null} eventCategories={null}>
    <div className="min-h-screen bg-[#f7f9f2] text-slate-800">

      <main dir={i18n.language==='ar'?'rtl':'ltr'}>
        <TopBanner featured={featured} />
        {/* <StatsBanner /> */}
        <Categories categories={categories} />
        <FeaturedProducts products={seasonal} type="seasonal" />
        {/* <Wholesale /> */}
        <About about={about} />
        <GiftPacks packs={packs} />
        <Deals />
        <FeaturedProducts products={featured} type="featured" />
        <Testimonials testimonials={testimonials} />
        <Newsletter />
      </main>
     
      
    </div>
    </ClientLayout>
  );
}
