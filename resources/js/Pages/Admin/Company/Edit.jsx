import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

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

    
    router.post('/admin/companies', formData );
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setCategory({
      ...category,
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
        <form action="" method="post" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name_ar">Arabic Name:</label>
              <input
                type="text"
                id="name_ar"
                name="name_ar"
                onChange={handleChange}

              />
          </div>
          <div className="form-group">
            <label htmlFor="name_en">English Name</label>
            <input
              type="text"
              id="name_en"
              name="name_en"
              onChange={handleChange}

            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              onChange={handleChange}

            />
          </div>
          <div className="form-group">
            <label htmlFor="role">role</label>
            <input
              type="text"
              id="role"
              name="role"
              onChange={handleChange}

            />
          </div>
          <div className="form-group">
            <label htmlFor="company_group_id">company group</label>
            <select 
              name="company_group_id" 
              id="company_group_id"
              onChange={handleChange}
              >
                {companyGroups.map((group)=>(
                  <option key={group.id} value={group.id}>{group.name.en}</option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <input type="submit" value="create" />
          </div>
        </form>
      </AdminLayout>
  );
};

export default createCompany;
