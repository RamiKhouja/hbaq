import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

const UpdateUser = ({user, auth}) => {
    const [errors, setErrors] = useState([])
    
    const [updatedUser, setUpdatedUser] = useState({
        firstname : user.firstname,
        lastname : user.lastname,
        email : user.email,
        phone : user.phone,
        role : user.role,
        image : null,
    })
    
      const handleFormSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
      
        formData.append('firstname', updatedUser.firstname);
        formData.append('lastname', updatedUser.lastname);
        formData.append('email', updatedUser.email);
        formData.append('role', updatedUser.role);
        formData.append('phone', updatedUser.phone);
        if (updatedUser.image) {
            formData.append('image', updatedUser.image);
        }
    
        formData.append('_method', 'PUT');

        router.post(`/admin/team/users/update/${user.id}`, formData, {
        forceFormData: true,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
        });
        // router.put(`/admin/team/users/update/${user.id}`, formData, {
        //     forceFormData: true,
        //     headers: {
        //       'Content-Type': 'multipart/form-data',
        //     }
        // });
      };
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setUpdatedUser({
            ...updatedUser,
            [name]: files 
            ? files[0] 
            : e.target.type === 'checkbox' 
                ? e.target.checked 
                : value,
        });
    };

    const handleFileChange = (e) => {
        handleChange(e);
        if (e.target.files.length > 0) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('image-preview').src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    return (
        <AdminLayout user={auth?.user}>
          <h1 className='mb-8 text-lg font-medium'>Edit User</h1>
          <form onSubmit={handleFormSubmit}>
              <div className='mb-8'>
                <InputLabel htmlFor="image" value="Picture" />
                <div className="mt-2 flex items-center gap-x-3">
                    <div>
                    <img
                        id="image-preview"
                        src={updatedUser.image ? URL.createObjectURL(updatedUser.image) : user.picture ? ('/'+user.picture) : '/pictures/user.jpg'}
                        alt="Preview"
                        className='w-32 rounded-full h-32 object-cover'
                    />
                    </div>
                    <div className="relative">
                        <button
                            type="button"
                            name="image"
                            className="rounded-md bg-white px-2.5 py-1.5 cursor-pointer text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={handleFileChange}
                        >
                            Choose Picture
                        </button>
                        <input
                            type="file"
                            name="image"
                            id="file-input"
                            className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                      <InputLabel htmlFor="name" value="First name" />
  
                      <TextInput
                          id="firstname"
                          name="firstname"
                          value={updatedUser.firstname}
                          className="mt-1 block w-full"
                          autoComplete="name"
                          isFocused={true}
                          onChange={handleChange}
                          required
                      />
  
                      <InputError message={errors.firstname} className="mt-2" />
                  </div>

                  <div>
                      <InputLabel htmlFor="name" value="Last name" />
  
                      <TextInput
                          id="lastname"
                          name="lastname"
                          value={updatedUser.lastname}
                          className="mt-1 block w-full"
                          autoComplete="name"
                          onChange={handleChange}
                      />
  
                      <InputError message={errors.lastname} className="mt-2" />
                  </div>
              </div>
  
              <div className="mt-8">
                  <InputLabel htmlFor="email" value="Email" />

                  <TextInput
                      id="email"
                      type="email"
                      name="email"
                      disabled
                      value={updatedUser.email}
                      className="mt-1 block w-full disabled:bg-gray-200"
                      autoComplete="email"
                      onChange={handleChange}
                      required
                  />

                  <InputError message={errors.email} className="mt-2" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                  <div>
                      <label htmlFor="parent" className="block text-sm font-medium leading-6 text-gray-900">
                      Role
                      </label>
                      <select
                          id="role"
                          name="role"
                          value={updatedUser.role}
                          onChange={handleChange}
                          className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brown-600 sm:text-sm sm:leading-6'
                      >
                          <option value='staff'>Staff</option>
                          <option value='admin'>Admin</option>
                          <option value='delivery'>Delivery</option>
                      </select>
                  </div>
                  <div>
                      <InputLabel htmlFor="phone" value="Phone number" />
  
                      <TextInput
                          id="phone"
                          name="phone"
                          value={updatedUser.phone}
                          className="mt-1 block w-full"
                          autoComplete="phone"
                          onChange={handleChange}
                      />
  
                      <InputError message={errors.phone} className="mt-2" />
                  </div>
              </div>
              
              <div className="flex flex-row-reverse mt-8">
                  <button
                      type="submit"
                      className="rounded-md bg-primary px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
                  >
                      Update User
                  </button>
              </div>
          </form>
  
        </AdminLayout>
    );
};

export default UpdateUser;
