import React from 'react';

import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

export default function AddressInput({address, setAddress}) {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });
  }

  const changeCountry = value => {
    setAddress({
      ...address,
      country: value,
    });
  }
  const changeState = value => {
    setAddress({
      ...address,
      state: value,
    });
  }
  const changeCity = value => {
    setAddress({
      ...address,
      city: value,
    });
  }

  // Return the JSX element
  return (
    <div className="flex flex-col gap-4">
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
          Country
        </label>
        <CountrySelect
          onChange={(e) => {
            changeCountry(e);
          }}
          placeHolder="Select Country"
        />
      </div>
      <div className="grid gap-x-4 grid-cols-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
            State
          </label>
          <StateSelect
              countryid={address.country.id}
              onChange={(e) => {
                changeState(e);
              }}
              placeHolder="Select State"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
            City
          </label>
          <CitySelect
              countryid={address.country.id}
              stateid={address.state.id}
              onChange={(e) => {
                changeCity(e);
              }}
              placeHolder="Select City"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
            Zip Code
          </label>
          <input
            type="text"
            name="zip"
            id="zip"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
            placeholder="Code"
            value={address.zip}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="grid gap-x-4 grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
            Address 1
          </label>
          <input
            type="text"
            name="address_1"
            id="address_1"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
            placeholder="Street address"
            value={address.address_1}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
            Address 2
          </label>
          <input
            type="text"
            name="address_2"
            id="address_2"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm sm:leading-6"
            placeholder="Street address 2"
            value={address.address_2}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}