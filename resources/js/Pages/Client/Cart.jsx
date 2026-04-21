import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import ClientLayout from '@/Layouts/ClientLayout';
import { useTranslation } from 'react-i18next';

const Cart = (props) => {

    const { flash } = usePage().props
    const {i18n, t} = useTranslation();

    const updatePurchase = (operator,product)=>{
        const data = new FormData();
      data.append('quantity', operator == '+' ? product.quantity+1 :product.quantity-1);
      data.append('id', product.id);
      console.log(data)
     
      router.post('/cart/update', data, {
        forceFormData: true,
      });
    }
    const deletePurchase = (product)=>{
        router.delete(`/cart/${product.id}`)
        
    }
    const deleteAll = ()=>{
        router.delete('/cart')

    }
    const order = ()=>{
        router.get('/cart/order')
    }

    return (
      <ClientLayout>
        {flash.success && isAlertVisible &&
        <div className="bg-green-100 rounded-lg text-green-800 px-4 py-3 shadow mb-3" role="alert" dir={i18n.language=='ar' ? ('rtl') : ('ltr')}>
          <div className="flex">
            <div className="py-1"><svg className="fill-current h-6 w-6 text-green-800 mx-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <div>
              <p className="text-sm">{flash.success}</p>
            </div>
          </div>
        </div>}
        <h1>Checkout</h1>
        
        <div className="table-wrp block">
        <button 
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
            onClick={()=>deleteAll()}
        >
            Empty Cart
        </button>
          <table className="w-full">
            <thead className="">
              <tr>
                  <th>image</th>
                  <th>name</th>
                  <th>quantity</th>
                  <th>price</th>
                  <th>actions</th>
              </tr>
            </thead>
            <tbody className="">
         
              {props.products && props.products.map( (product) => (
                <tr key={product.id}>
                  <td><img className='h-16' src ={product.main_image} /></td>
                  <td>{JSON.parse(product.name).en}</td>
                  <td>
                    {product.quantity}
                    <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                     onClick={()=>{updatePurchase('+',product)}}
                     >
                        +
                    </button>
                    <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                     onClick={()=>{updatePurchase('-',product)}}
                     >
                        -
                    </button>
                  </td>
                  <td>{product.price}</td>
                  <td>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 " onClick={()=>{deletePurchase(product)}}>delete</button>
                  </td> 
                </tr> ))}
                <tr>
                    <td>Total</td>
                    <td>{props.cart.subTotal}</td>
                </tr>
            </tbody>
          </table>
          <button onClick={order}>Order</button>
        </div>

    </ClientLayout>
    );
  };
  
  export default Cart;
  