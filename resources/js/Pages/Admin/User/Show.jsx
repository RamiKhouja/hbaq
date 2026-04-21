import React, {useState} from 'react'

import AdminLayout from '@/Layouts/AdminLayout';


const showUser = ({user, auth})=> {

  return (
    <AdminLayout user={auth?.user}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses.map((address, index) => (
          <Address key={index} address={address} />
        ))}
      </div>

    </AdminLayout>
  )
}
export default showUser