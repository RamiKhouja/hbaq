import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({companyGroup, auth}) {

  const [group, setGroup] = useState({ 
    name: { ar: companyGroup.name.ar, en: companyGroup.name.en },
    label: companyGroup.label,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'ar' || name === 'en') {
      setGroup({
        ...group,
        name: {
          ...group.name,
          [name]: value,
        },
      });
    } else {
      setGroup({
        ...group,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.put(`/admin/company-groups/${companyGroup.id}`, group);
  };

  return (
    <AdminLayout user={auth?.user}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="arabicName">Arabic Name:</label>
          <input
            type="text"
            id="arabicName"
            name="ar"
            value={group.name.ar}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="englishName">English Name:</label>
          <input
            type="text"
            id="englishName"
            name="en"
            value={group.name.en}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="label">Label:</label>
          <input
            type="text"
            id="label"
            name="label"
            value={group.label}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </AdminLayout>
  )
}
