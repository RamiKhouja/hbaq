import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function Index({ auth, packages }) {
  const { i18n } = useTranslation();
  const { flash } = usePage().props;
  const lang = i18n.language;

  return (
    <AdminLayout user={auth?.user}>
      <Head title="Emballages" />
      {flash.success && <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-green-800">{flash.success}</div>}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Emballages</h1>
            <p className="mt-1 text-sm text-gray-500">Gérez les boîtes et emballages disponibles pour les packs personnalisés.</p>
          </div>
          <Link href="/admin/catalog/packages/create" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Ajouter un emballage</Link>
        </div>
        <div className="mt-8 overflow-hidden rounded-lg bg-white shadow ring-1 ring-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr>
              {['Image', 'Nom', 'Prix', 'Statut', ''].map((label) =>  <th key={label} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">{label}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {packages.data.map((item) =>  <tr key={item.id}>
                <td className="px-4 py-3"><img src={`/${item.image}`} className="h-14 w-14 rounded-lg object-cover" /></td>
                <td className="px-4 py-3 font-medium text-gray-900">{item.name?.[lang] || item.name?.en}</td>
                <td className="px-4 py-3">{Number(item.price).toFixed(2)} DT</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.is_active ? 'Actif' : 'Masqué'}</span></td>
                <td className="px-4 py-3"><div className="flex justify-end gap-3">
                  <Link href={`/admin/catalog/packages/edit/${item.id}`}><PencilSquareIcon className="h-5 w-5" /></Link>
                  {auth?.user?.role === 'admin' && <button onClick={() => confirm('Supprimer cet emballage ?') && router.delete(`/admin/catalog/packages/${item.id}`)}><TrashIcon className="h-5 w-5 text-red-700" /></button>}
                </div></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
