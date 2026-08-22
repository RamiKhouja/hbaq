import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';

export default function Edit({ auth, settings }) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    company_name: settings?.company_name || 'Hbaq',
    fiscal_number: settings?.fiscal_number || '',
    address: settings?.address || '',
    phone: settings?.phone || '',
    email: settings?.email || '',
    rib: settings?.rib || '',
    vat_rate: settings?.vat_rate || '0',
    logo: null,
    signature: null,
    stamp: null,
  });

  const submit = (event) => {
    event.preventDefault();
    post('/admin/hbaq-settings', { forceFormData: true, preserveScroll: true });
  };

  const fields = [
    ['company_name', t('admin.hbaq-settings.company-name'), 'text', true],
    ['fiscal_number', t('admin.hbaq-settings.fiscal-number'), 'text', true],
    ['phone', t('admin.hbaq-settings.phone'), 'text', true],
    ['email', t('admin.hbaq-settings.email'), 'email', true],
    ['rib', t('admin.hbaq-settings.rib'), 'text', false],
    ['vat_rate', t('admin.hbaq-settings.vat-rate'), 'number', true],
  ];

  const imageFields = [
    ['logo', t('admin.hbaq-settings.logo')],
    ['signature', t('admin.hbaq-settings.signature')],
    ['stamp', t('admin.hbaq-settings.stamp')],
  ];

  return (
    <AdminLayout user={auth?.user}>
      <Head title={t('admin.hbaq-settings.title')} />
      <div className="mx-auto max-w-4xl">
        <h1 className="text-xl font-semibold text-gray-900">{t('admin.hbaq-settings.title')}</h1>
        <p className="mt-2 text-sm text-gray-600">{t('admin.hbaq-settings.description')}</p>

        <form onSubmit={submit} className="mt-8 space-y-8">
          <div className="grid grid-cols-1 gap-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 md:grid-cols-2">
            {fields.map(([name, label, type, required]) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-900">
                  {label}{required && ' *'}
                </label>
                <input
                  id={name}
                  type={type}
                  min={name === 'vat_rate' ? 0 : undefined}
                  max={name === 'vat_rate' ? 100 : undefined}
                  step={name === 'vat_rate' ? '0.01' : undefined}
                  value={data[name]}
                  onChange={(event) => setData(name, event.target.value)}
                  className="mt-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm"
                  required={required}
                />
                {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}
              </div>
            ))}

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-900">
                {t('admin.hbaq-settings.address')} *
              </label>
              <textarea
                id="address"
                rows="3"
                value={data.address}
                onChange={(event) => setData('address', event.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm"
                required
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 md:grid-cols-3">
            {imageFields.map(([name, label]) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-900">{label}</label>
                {settings?.[name] && (
                  <img src={`/${settings[name]}`} alt={label} className="mt-3 h-24 w-full rounded-md border border-gray-200 object-contain p-2" />
                )}
                <input
                  id={name}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => setData(name, event.target.files[0] || null)}
                  className="mt-3 block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-green-50 file:px-3 file:py-2 file:font-medium file:text-green-800 hover:file:bg-green-100"
                />
                {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-4">
            {recentlySuccessful && <span className="text-sm text-green-700">{t('admin.hbaq-settings.saved')}</span>}
            <button disabled={processing} className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60">
              {processing ? t('admin.hbaq-settings.saving') : t('admin.hbaq-settings.save')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
