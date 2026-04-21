import React, {useState, useEffect} from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import DeleteModal from '@/Components/DeleteModal';


export default function Index({users, auth}) {

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const { flash } = usePage().props
  useEffect(() => {
    if (flash.success) {
      setIsAlertVisible(true);
      const timeoutId = setTimeout(() => {
        setIsAlertVisible(false);
      }, 3000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [flash.success]);
  useEffect(()=>{},[users]);

  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  function prepareUserDelete (user) {
    setOpen(true);
    setUserToDelete(user);
  }

  function deleteUser( id ) {
    router.delete(`/admin/users/${id}`);
  }

  const roleColors = {
    admin: "bg-blue-100 text-blue-600",
    staff: "bg-amber-100 text-amber-700",
    delivery: "bg-purple-100 text-purple-600",
  };

  const renderRole = (role) => {
    const colorClass = roleColors[role] || "bg-gray-100 text-gray-600"; // Default color
    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1); // Capitalize
    return (
      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${colorClass}`}>
        {formattedRole}
      </span>
    );
  };

  return (
    <>
    <AdminLayout user={auth?.user}>
      <Head title="Team" />
      <div className="px-4 sm:px-6 lg:px-8">
        {flash.success && isAlertVisible &&
        <div className="bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow mb-3" role="alert">
          <div className="flex">
            <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <div>
              <p className="font-bold">Success!</p>
              <p className="text-sm">{flash.success}</p>
            </div>
          </div>
        </div>}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Admins</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all your team members.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              type="button"
              href='/admin/team/users/create'
              className="block rounded-md bg-primary px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brown-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown-600"
            >
              Add team member
            </Link>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Picture
                    </th>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Phone
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 flex justify-center">
                      
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users && users.map( (user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap">
                        <img src={user.picture ? `/${user.picture}` : '/pictures/user.jpg'} alt={user.firstname + ' ' + user.lastname} className="h-10 w-10 rounded-full object-cover" />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{user.firstname} {user.lastname??''}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{user.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{user.phone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{renderRole(user.role)}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex space-x-2 items-center justify-center">
                        <Link title="Edit" href={`/admin/team/users/edit/${user.id}`} className="text-gray-800 hover:text-brown-900">
                          <PencilSquareIcon className='w-5 h-5'/>
                        </Link>
                        <button type="button" onClick={()=>prepareUserDelete(user)} className="text-red-800 hover:text-brown-900">
                          <TrashIcon className='w-5 h-5'/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>    
    </AdminLayout>
    <DeleteModal 
      open={open} 
      setOpen={setOpen} 
      id={userToDelete?.id} 
      name={userToDelete?.name + ' ' + userToDelete?.lastname??''}
      deleteItem={deleteUser}
      what={"Admin"}
    />
    </>
  )
}
