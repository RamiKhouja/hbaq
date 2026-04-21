import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';

const EditRequest = ({ request, auth }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    status: request.status,
    //payed: request.payed,
    date: request.date,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    router.post(`/admin/requests/update/${request.id}`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return (
    <AdminLayout user={auth?.user}>
      <div className="sm:flex-auto mb-4">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          Edit Request
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Update the state of the request and its details.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-x-4 grid-cols-4 mb-8">
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={request.first_name}
              disabled
              className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={request.last_name}
              disabled
              className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={request.email}
              disabled
              className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={request.phone}
              disabled
              className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <label htmlFor="service" className="block text-sm font-medium leading-6 text-gray-900">
          Services
        </label>
        <div className="grid gap-x-4 grid-cols-4 mb-4">
        {request.services && request.services.map(service => (
          <div className="mb-4" key={service.id}> 
            <input
              type="text"
              id="serive"
              name="service"
              value={service.name.en}
              disabled
              className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            />
          </div>
        ))}
        </div>
        <div className="mb-8">
          <label htmlFor="message" className="block text-sm font-medium leading-6 text-gray-900">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={request.message || ''}
            disabled
            className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="grid gap-x-4 grid-cols-4 mb-4">
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
              Date Requested
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
              Payment Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            >
              <option value="pending">Pending</option>
              <option value="payed">Payed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
          {/* <div className="mb-4">
            <label htmlFor="payed" className="block text-sm font-medium leading-6 text-gray-900">
              {t('admin.request.payed')}
            </label>
            <input
              type="number"
              id="payed"
              name="payed"
              value={formData.payed}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            />
          </div> */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
              Total Amount
            </label>
            <input
              type="text"
              id="total"
              name="total"
              value={`${request.total} TND`}
              disabled
              className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <button
            type="submit"
            className="rounded-md bg-primary px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
          >
           Update Request
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditRequest;
