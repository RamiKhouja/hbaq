import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function PackCategoryForm({ auth, category = null, parentCats = [] }) {
  const [preview, setPreview] = useState(category?.image ? `/${category.image}` : '/pictures/default.jpg');
  const [form, setForm] = useState({
    name_en: category?.name?.en || '', name_fr: category?.name?.fr || '', name_ar: category?.name?.ar || '',
    description_en: category?.description?.en || '', description_fr: category?.description?.fr || '', description_ar: category?.description?.ar || '',
    parent_id: category?.parent_id || '', type: category?.type || 'menu', menu_show: category ? Boolean(category.menu_show) : true, image: null,
  });

  const change = (event) => {
    const { name, value, files, checked, type } = event.target;
    const next = files ? files[0] : type === 'checkbox' ? checked : value;
    setForm((previous) => ({ ...previous, [name]: next }));
    if (files?.[0]) setPreview(URL.createObjectURL(files[0]));
  };

  const submit = (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== '' && value !== null) data.append(key, typeof value === 'boolean' ? (value ? 1 : 0) : value);
    });
    router.post(category ? `/admin/catalog/pack-categories/update/${category.id}` : '/admin/catalog/pack-categories', data, { forceFormData: true });
  };

  return (
    <AdminLayout user={auth?.user}>
      <div className="mb-6">
        <h1 className="text-base font-semibold text-gray-900">{category ? 'Modifier la catégorie de packs' : 'Nouvelle catégorie de packs'}</h1>
        <p className="mt-2 text-sm text-gray-600">Les champs correspondent aux catégories du catalogue.</p>
      </div>
      <form onSubmit={submit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Catégorie parente</label>
          <select name="parent_id" value={form.parent_id} onChange={change} className="mt-2 block w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-gray-300">
            <option value="">Aucune</option>
            {parentCats.map((item) => <option key={item.id} value={item.id}>{item.name?.fr || item.name?.en}</option>)}
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field name="name_en" label="Nom (anglais) *" value={form.name_en} onChange={change} />
          <Field name="name_fr" label="Nom (français) *" value={form.name_fr} onChange={change} />
          <Field name="name_ar" label="Nom (arabe)" value={form.name_ar} onChange={change} dir="rtl" />
        </div>
        <div>
          <label className="block text-sm font-medium">Image</label>
          <div className="mt-2 flex items-center gap-4"><img src={preview} className="h-24 w-24 rounded object-cover" alt="Aperçu" /><input type="file" name="image" onChange={change} /></div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Area name="description_en" label="Description (anglais)" value={form.description_en} onChange={change} />
          <Area name="description_fr" label="Description (français)" value={form.description_fr} onChange={change} />
          <Area name="description_ar" label="Description (arabe)" value={form.description_ar} onChange={change} dir="rtl" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="type" label="Type" value={form.type} onChange={change} />
          <label className="flex items-center gap-2 pt-7 text-sm font-medium"><input type="checkbox" name="menu_show" checked={form.menu_show} onChange={change} /> Afficher dans le menu</label>
        </div>
        <div className="flex justify-end"><button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white">{category ? 'Mettre à jour' : 'Créer la catégorie'}</button></div>
      </form>
    </AdminLayout>
  );
}

function Field({ label, ...props }) { return <label className="block text-sm font-medium">{label}<input {...props} className="mt-2 block w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-gray-300" /></label>; }
function Area({ label, ...props }) { return <label className="block text-sm font-medium">{label}<textarea {...props} rows="4" className="mt-2 block w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-gray-300" /></label>; }
