import { Dialog, Transition } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next';

function DeleteModal({open, setOpen, id, deleteItem, name, what}) {
  const {t, i18n} = useTranslation();
  const lang=i18n.language;
  const deleteFunction = (id) => {
      deleteItem(id);
      setOpen(false);
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <TrashIcon className="h-6 w-6 text-red-700" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {t('admin.delete.delete')} {what}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                      {t('admin.delete.really-want')} {name}?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 flex justify-center gap-x-4">
                  <button
                    type="button"
                    className="inline-flex w-fit justify-center rounded-full bg-primary border border-brown-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brown-600  hover:border-brown-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
                    onClick={() => setOpen(false)}
                  >
                    {t('admin.delete.cancel')}
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-fit justify-center rounded-full bg-white border border-brown-600 px-3 py-1.5 text-sm font-semibold text-brown-600 shadow-sm hover:bg-brown-600 hover:border-brown-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
                    onClick={() => deleteFunction(id)}
                  >
                    {t('admin.delete.delete')}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default DeleteModal