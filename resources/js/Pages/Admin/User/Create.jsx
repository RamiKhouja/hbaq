import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

const createUser = ({auth}) => {
    const [errors, setErrors] = useState([])
    const [user, setUser] = useState({
        firstname : '',
        lastname : '',
        email : '',
        password : '',
        phone : '',
        role : 'staff',
        password_confirmation: '',
        image: null
    })
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setUser({
            ...user,
            [name]: files 
            ? files[0] 
            : e.target.type === 'checkbox' 
                ? e.target.checked 
                : value,
        });
    };

    const handleFileChange = (e) => {
        console.log(e.target.files);
        handleChange(e);

        // Show preview if an image is selected
        if (e.target.files.length > 0) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('image-preview').src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
        }
    };
    
      const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
      
        formData.append('firstname', user.firstname);
        formData.append('lastname', user.lastname);
        formData.append('email', user.email);
        formData.append('phone', user.phone);
        formData.append('role', user.role);
        formData.append('password', user.password);
        formData.append('password_confirmation', user.password_confirmation);
        if (user.image) {
            formData.append('image', user.image);
        }
        router.post('/admin/team/users/store', formData );
      };
    
      return (
        
          <AdminLayout user={auth?.user}>
            <h1 className='mb-8 text-lg font-medium'>Create User</h1>
            <form onSubmit={handleFormSubmit}>
                <div className='mb-8'>
                    <InputLabel htmlFor="image" value="Picture" />
                    <div className="mt-2 flex items-center gap-x-3">
                        <div>
                        <img
                            id="image-preview"
                            src={user.image ? URL.createObjectURL(user.image) : '/pictures/user.jpg'}
                            alt="Preview"
                            className='w-32 h-32 object-cover rounded-full'
                        />
                        </div>
                        <div className="relative">
                            <button
                                type="button"
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
                            value={user.firstname}
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
                            value={user.lastname}
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
                        value={user.email}
                        className="mt-1 block w-full"
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
                            defaultValue={'staff'}
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
                            value={user.phone}
                            className="mt-1 block w-full"
                            autoComplete="phone"
                            onChange={handleChange}
                        />
                        <InputError message={errors.phone} className="mt-2" />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={user.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={handleChange}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={user.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={handleChange}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                </div>
                <div className="flex flex-row-reverse mt-8">
                    <button
                        type="submit"
                        className="rounded-md bg-primary px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
                    >
                        Create User
                    </button>
                </div>
            </form>
    
          </AdminLayout>
      );
};

export default createUser;
