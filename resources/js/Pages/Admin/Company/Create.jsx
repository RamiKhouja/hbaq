import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';


const createCompany = ({companyGroups, auth}) => {
  const [company, setCompany] = useState({
    name_ar: '',
    name_en: '',
    phone: '',
    role: '',
    companyGroup_id: null
  });




  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name_ar', company.name_ar);
    formData.append('name_en', company.name_en);
    formData.append('phone', company.phone);
    formData.append('role', company.role);
    formData.append('companyGroup_id', company.companyGroup_id);

    
    router.post('/admin/company', formData);
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setCompany({
      ...company,
      [name]: files 
        ? files[0] 
        : e.target.type === 'checkbox' 
          ? e.target.checked 
          : value,
    });
  };

  return (
      <AdminLayout user={auth?.user}>
        <h1>Create Company</h1>
        <form  onSubmit={handleSubmit}>
            <div >
              <InputLabel htmlFor="name_ar">Arabic Name:</InputLabel>
              <TextInput
                type="text"
                id="name_ar"
                name="name_ar"
                value={company.name_ar}
                onChange={handleChange}

              />
          </div>
          <div className="mt-4">
            <InputLabel htmlFor="name_en">English Name</InputLabel>
            <TextInput
              type="text"
              id="name_en"
              name="name_en"
              value={company.name_en}
              onChange={handleChange}

            />
          </div>
          <div className="mt-4">
            <InputLabel htmlFor="phone">phone</InputLabel>
            <TextInput
              type="text"
              id="phone"
              name="phone"
              value={company.phone}
              onChange={handleChange}

            />
          </div>
          <div className="mt-4">
            <InputLabel htmlFor="role">role</InputLabel>
            <TextInput
              type="text"
              id="role"
              name="role"
              value={company.role}
              onChange={handleChange}

            />
          </div>
          <div className="mt-4">
            <InputLabel htmlFor="company_group_id">company group</InputLabel>
            <select 
              name="companyGroup_id" 
              id="companyGroup_id"
              onChange={handleChange}
              >
                <option value=""></option>
                {companyGroups.map((group)=>(
                  <option key={group.id} value={group.id}>{group.name.en}</option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <PrimaryButton>create</PrimaryButton>
          </div>
        </form>
      </AdminLayout>
  );
};

export default createCompany;
