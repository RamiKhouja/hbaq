import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import ServiceModal from "./ServiceModal";
import { useState } from "react";

export default function ServicesSection({services, user}) {

  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleOpenModal = (id) => {
    setModalOpen(true);
    setSelectedId(id);
  };

  function truncateString(inputString, maxWords) {
    const words = inputString.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + ' ...';
    } else {
      return inputString;
    }
  }

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            {t('service.title')}
          </h2>
          <p className="my-2 text-lg/8 text-gray-600">{t("service.subtitle")}</p>
          <Link href="/services" className="hidden text-sm lg:text-lg font-medium text-primary hover:text-brown-800 md:block">
              <span className="border-b-2 border-b-primary">
                {t('service.discover-all-services')}
              </span>
              {lang==='ar' ? (
                  <span aria-hidden="true">&larr;</span>
              ):(
                  <span aria-hidden="true">&rarr;</span>
              )}
          </Link>
        </div>
        <div className="mx-auto mt-12 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-16 lg:mx-0 lg:max-w-none md:grid-cols-2 lg:grid-cols-3">
          {services?.map((service) => (
            <article
              key={service.id}
              className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-56 sm:pt-48 lg:pt-56 hover:opacity-95"
            >
              <img alt="" src={`/${service.image}`} className="absolute inset-0 -z-10 h-full object-cover" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
              <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              <h3 className="mt-3 text-3xl font-bold text-white">
                <Link href={`/service/${service.url}`}>
                  <span className="absolute inset-0" />
                  {i18n.language==='en' ? service.name?.en : (i18n.language==='ar' ? service.name?.ar : service.name?.fr)}
                </Link>
              </h3>
              <p className="text-base font-normal text-white mt-4">
                {truncateString(
                  i18n.language==='en' ? service.description?.en : (i18n.language==='ar' ? service.description?.ar : service.description?.fr)
                , 20)}
              </p>
              <button
                onClick={() => handleOpenModal(service.id)}
                className="mt-6 z-40 rounded-full bg-primary border border-primary hover:bg-transparent hover:border-white hover:text-white shadow-lg px-3 py-1 text-brown-800 text-sm font-semibold w-fit"
              >
                {t('service.book-service')}
              </button>
            </article>
          ))}
        </div>
      </div>
      <ServiceModal open={modalOpen} setOpen={setModalOpen} user={user} id={selectedId} />
    </div>
  )
}
