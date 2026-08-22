import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function PackageForm({ auth, package: packageItem = null }) {
  const [preview, setPreview] = useState(packageItem?.image ? `/${packageItem.image}` : '/pictures/default.jpg');
  const [form, setForm] = useState({
    name_en: packageItem?.name?.en || '',
    name_ar: packageItem?.name?.ar || '',
    name_fr: packageItem?.name?.fr || '',
    description_en: packageItem?.description?.en || '',
    description_ar: packageItem?.description?.ar || '',
    description_fr: packageItem?.description?.fr || '',
    price: packageItem?.price || '',
    is_active: packageItem ? Boolean(packageItem.is_active) : true,
    image: null,
  });

  const update = (event) => {
    const { name, value, type, checked, files } = event.target;
    setForm((current) => ({ ...current, [name]: files ? files[0] : type === 'checkbox' ? checked : value }));
    if (files?.[0]) setPreview(URL.createObjectURL(files[0]));
  };

  const submit = (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) data.append(key, typeof value === 'boolean' ? (value ? 1 : 0) : value);
    });
    router.post(packageItem ? `/admin/catalog/packages/update/${packageItem.id}` : '/admin/catalog/packages', data);
  };

  return (
    <AdminLayout user={auth?.user}>
      <Head title={packageItem ? 'Edit package' : 'Add package'} />
      <form onSubmit={submit} className="mx-auto max-w-4xl space-y-8 rounded-xl bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{packageItem ? 'Edit package' : 'Add package'}</h1>
            <p className="mt-1 text-sm text-gray-500">The box, basket, or wrapping customers choose for a custom pack.</p>
          </div>
          <Link href="/admin/catalog/packages" className="text-sm font-semibold text-primary">Back</Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {['en', 'fr', 'ar'].map((lang) => (
            <label key={lang} className="text-sm font-medium text-gray-700">
              Name ({lang.toUpperCase()})
              <input required name={`name_${lang}`} value={form[`name_${lang}`]} onChange={update} dir={lang === 'ar' ? 'rtl' : 'ltr'} className="mt-1 block w-full rounded-md border-gray-300" />
            </label>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {['en', 'fr', 'ar'].map((lang) => (
            <label key={lang} className="text-sm font-medium text-gray-700">
              Description ({lang.toUpperCase()})
              <textarea name={`description_${lang}`} value={form[`description_${lang}`]} onChange={update} dir={lang === 'ar' ? 'rtl' : 'ltr'} rows="4" className="mt-1 block w-full rounded-md border-gray-300" />
            </label>
          ))}
        </div>

        <div className="grid items-end gap-6 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Price (DT)
            <input required min="0" step="0.01" type="number" name="price" value={form.price} onChange={update} className="mt-1 block w-full rounded-md border-gray-300" />
          </label>
          <label className="flex items-center gap-3 pb-3 text-sm font-medium text-gray-700">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={update} className="rounded border-gray-300 text-primary" />
            Available in the pack builder
          </label>
        </div>

        <div className="grid items-center gap-6 md:grid-cols-[180px_1fr]">
          <img src={preview} alt="" className="h-40 w-40 rounded-xl object-cover ring-1 ring-gray-200" />
          <label className="text-sm font-medium text-gray-700">
            Image
            <input required={!packageItem} type="file" accept="image/*" name="image" onChange={update} className="mt-2 block w-full text-sm" />
          </label>
        </div>

        <button className="rounded-md bg-primary px-5 py-2.5 font-semibold text-white hover:bg-brown-700">
          {packageItem ? 'Save package' : 'Create package'}
        </button>
      </form>
    </AdminLayout>
  );
}
