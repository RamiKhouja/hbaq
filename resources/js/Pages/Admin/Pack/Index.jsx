import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function Index({ auth, packs }) {
  const { i18n } = useTranslation();
  const { flash } = usePage().props;
  const lang = i18n.language;

  const deletePack = (id) => {
    router.delete(`/admin/catalog/packs/${id}`);
  };

  return (
    <AdminLayout user={auth?.user}>
      <Head title="Packs" />
      {flash.success && (
        <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-green-800 shadow">
          {flash.success}
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Packs</h1>
            <p className="mt-2 text-sm text-gray-500">Gérez les packs cadeaux et les produits qu’ils contiennent.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/admin/catalog/packs/create" className="block rounded-md bg-primary px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brown-600">
              Add Pack
            </Link>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className={lang === 'ar' ? 'text-right' : 'text-left'}>
              <tr>
                <th className="px-3 py-3.5 text-sm font-semibold text-gray-900">Image</th>
                <th className="px-3 py-3.5 text-sm font-semibold text-gray-900">Nom</th>
                <th className="px-3 py-3.5 text-sm font-semibold text-gray-900">Prix</th>
                <th className="px-3 py-3.5 text-sm font-semibold text-gray-900">Stock</th>
                <th className="px-3 py-3.5 text-sm font-semibold text-gray-900">Produits</th>
                <th className="px-3 py-3.5 text-sm font-semibold text-gray-900">Mis en avant</th>
                <th className="relative px-3 py-3.5"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {packs.data.map((pack) => (
                <tr key={pack.id}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <img src={`/${pack.main_image}`} alt={pack.name?.en} className="h-10 w-10 rounded object-cover" />
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{pack.name?.[lang] || pack.name?.en}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    {pack.price_after_discount} DT
                    {pack.is_discount && <span className="ml-2 text-xs text-gray-400 line-through">{pack.price} DT</span>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{pack.stock}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{pack.products?.length || 0}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{pack.is_featured ? 'Oui' : 'Non'}</td>
                  <td className="flex items-center gap-x-2 px-3 py-4 text-right text-sm font-medium">
                    <Link title="Voir sur le site" href="/gift-packs" className="text-gray-800 hover:text-brown-900">
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    <Link title="Modifier le pack" href={`/admin/catalog/packs/edit/${pack.id}`} className="text-gray-800 hover:text-brown-900">
                      <PencilSquareIcon className="h-5 w-5" />
                    </Link>
                    {auth?.user?.role === 'admin' && (
                      <button title="Supprimer le pack" type="button" onClick={() => deletePack(pack.id)} className="text-red-800 hover:text-brown-900">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-end">
          {packs.links.map((link, index) => link.url ? (
            <Link key={index} className={`mr-2 rounded-full px-3 py-1 ring-1 ring-primary hover:bg-brown-800 hover:text-white ${link.active ? 'bg-primary text-white' : 'bg-white text-primary'}`} href={link.url}>
              {link.label}
            </Link>
          ) : null)}
        </div>
      </div>
    </AdminLayout>
  );
}
