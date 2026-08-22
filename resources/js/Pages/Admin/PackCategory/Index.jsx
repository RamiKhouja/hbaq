import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function Index({ auth, categories }) {
  const { i18n } = useTranslation();
  const { flash } = usePage().props;
  const lang = i18n.language;
  return <AdminLayout user={auth?.user}>
    <Head title="Catégories de packs" />
    {flash.success && <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-green-800">{flash.success}</div>}
    <div className="flex items-center justify-between">
      <div><h1 className="font-semibold text-gray-900">Catégories de packs</h1><p className="mt-2 text-sm text-gray-600">Gérez les catégories utilisées exclusivement par les packs.</p></div>
      <Link href="/admin/catalog/pack-categories/create" className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white">Ajouter une catégorie</Link>
    </div>
    <div className="mt-8 overflow-x-auto"><table className="min-w-full divide-y divide-gray-300">
      <thead><tr className="text-left"><th className="px-3 py-3">Image</th><th className="px-3 py-3">Nom</th><th className="px-3 py-3">Parent</th><th className="px-3 py-3">Dans le menu</th><th /></tr></thead>
      <tbody className="divide-y divide-gray-200">{categories.map((item) => <tr key={item.id}>
        <td className="px-3 py-3">{item.image && <img src={`/${item.image}`} className="h-10 w-10 rounded object-cover" />}</td>
        <td className="px-3 py-3 text-sm">{item.name?.[lang] || item.name?.fr || item.name?.en}</td>
        <td className="px-3 py-3 text-sm">{item.parent?.name?.[lang] || item.parent?.name?.fr || item.parent?.name?.en || '—'}</td>
        <td className="px-3 py-3 text-sm">{item.menu_show ? 'Oui' : 'Non'}</td>
        <td className="flex justify-end gap-2 px-3 py-3"><Link href={`/admin/catalog/pack-categories/edit/${item.id}`}><PencilSquareIcon className="h-5 w-5" /></Link>{auth?.user?.role === 'admin' && <button onClick={() => confirm('Supprimer cette catégorie ?') && router.delete(`/admin/catalog/pack-categories/${item.id}`)}><TrashIcon className="h-5 w-5 text-red-700" /></button>}</td>
      </tr>)}</tbody>
    </table></div>
  </AdminLayout>;
}
