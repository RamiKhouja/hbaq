import React from 'react';

export default function Address({ address }) {
  // Destructure the address object
  const { name, street, city, state, zip, country } = address;

  // Return the JSX element
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-gray-600">{street}</p>
      <p className="text-gray-600">{city}, {state} {zip}</p>
      <p className="text-gray-600">{country}</p>
    </div>
  );
}