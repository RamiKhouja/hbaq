import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BuildingStorefrontIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

function Newsletter() {
  const { t } = useTranslation();
  const { auth } = usePage().props;
  const user = auth?.user;
  const [form, setForm] = useState({
    name: [user?.firstname, user?.lastname].filter(Boolean).join(' '),
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: BuildingStorefrontIcon,
      label: t('homepage.newsletter.contact.address'),
      value: '12 Garden Avenue, Tunis 1002',
    },
    {
      icon: PhoneIcon,
      label: t('homepage.newsletter.contact.phone'),
      value: '+216 71 234 567',
      href: 'tel:+21671234567',
    },
    {
      icon: EnvelopeIcon,
      label: t('homepage.newsletter.contact.email'),
      value: 'contact@hbaq.tn',
      href: 'mailto:contact@hbaq.tn',
    },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  useEffect(() => {
    if (!status.message) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setStatus({ type: '', message: '' });
    }, 3000);

    return () => clearTimeout(timeout);
  }, [status.message]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    axios.post('/api/contact', {
      ...form,
      subject: 'Homepage contact form',
    })
      .then(() => {
        setForm({ name: '', email: '', phone: '', message: '' });
        setStatus({ type: 'success', message: t('homepage.newsletter.success') });
      })
      .catch(() => {
        setStatus({ type: 'error', message: t('homepage.newsletter.error') });
      })
      .finally(() => setIsSubmitting(false));
  };

  const inputClass = "h-12 w-full rounded-xl border border-white/10 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-300 focus:ring-2 focus:ring-green-300/40";

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
      <div className="grid gap-8 rounded-3xl bg-slate-900 px-5 py-10 text-white shadow-2xl sm:px-8 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div>
          <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">{t('homepage.newsletter.badge')}</span>
          <h2 className="mt-6 text-2xl font-bold sm:text-3xl md:text-4xl">{t('homepage.newsletter.title')}</h2>
          <p className="mt-4 max-w-xl text-sm leading-8 text-slate-300 md:text-base">
            {t('homepage.newsletter.description')}
          </p>

          <dl className="mt-8 space-y-4">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              const content = (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-green-200">{item.label}</dt>
                  <dd className="mt-1 text-sm text-white">{item.value}</dd>
                </div>
              );

              return (
                <div key={item.label} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Icon className="mt-1 h-5 w-5 flex-none text-green-300" aria-hidden="true" />
                  {item.href ? (
                    <a href={item.href} className="transition hover:text-green-200">{content}</a>
                  ) : content}
                </div>
              );
            })}
          </dl>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="newsletter-name" className="mb-2 block text-sm font-semibold text-slate-100">{t('homepage.newsletter.form.name')}</label>
              <input
                id="newsletter-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className={inputClass}
                placeholder={t('homepage.newsletter.form.name_placeholder')}
              />
            </div>
            <div>
              <label htmlFor="newsletter-phone" className="mb-2 block text-sm font-semibold text-slate-100">{t('homepage.newsletter.form.phone')} <span className="font-normal text-slate-400">{t('homepage.newsletter.form.optional')}</span></label>
              <input
                id="newsletter-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                className={inputClass}
                placeholder="+216 20 123 456"
              />
            </div>
          </div>

          <div>
            <label htmlFor="newsletter-email" className="mb-2 block text-sm font-semibold text-slate-100">{t('homepage.newsletter.form.email')}</label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className={inputClass}
              placeholder={t('homepage.newsletter.form.email_placeholder')}
            />
          </div>

          <div>
            <label htmlFor="newsletter-message" className="mb-2 block text-sm font-semibold text-slate-100">{t('homepage.newsletter.form.message')}</label>
            <textarea
              id="newsletter-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-300 focus:ring-2 focus:ring-green-300/40"
              placeholder={t('homepage.newsletter.form.message_placeholder')}
            />
          </div>

          {status.message && (
            <p className={`rounded-xl px-4 py-3 text-sm ${status.type === 'success' ? 'bg-green-500/15 text-green-100' : 'bg-red-500/15 text-red-100'}`}>
              {status.message}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-8 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                  {t('homepage.newsletter.form.sending')}
                </>
              ) : t('homepage.newsletter.form.submit')}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Newsletter
