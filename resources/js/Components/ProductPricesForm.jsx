import React from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export const emptyProductPrice = () => ({
  price: '',
  min_qty: 0,
  max_qty: 1,
  discount_price: '',
  discount_percentage: '',
  start_date: '',
  end_date: '',
});

const numberValue = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const rounded = (value) => {
  if (!Number.isFinite(value)) {
    return '';
  }

  return Math.max(value, 0).toFixed(2);
};

export default function ProductPricesForm({ prices, setPrices, submitted = false }) {
  const updatePrice = (index, field, value) => {
    setPrices(prev => {
      const next = [...prev];
      const current = { ...next[index], [field]: value };
      const basePrice = numberValue(field === 'price' ? value : current.price);

      if (field === 'price' && basePrice <= 0) {
        current.discount_price = '';
        current.discount_percentage = '';
        current.start_date = '';
        current.end_date = '';
      }

      if (field === 'price' && numberValue(current.discount_percentage) > 0) {
        current.discount_price = rounded(basePrice - (basePrice * numberValue(current.discount_percentage) / 100));
      }

      if (field === 'discount_price') {
        const discountPrice = Math.min(numberValue(value), Math.max(basePrice - 0.01, 0));
        current.discount_price = discountPrice > 0 ? rounded(discountPrice) : '';
        current.discount_percentage = basePrice > 0 && discountPrice > 0
          ? rounded(((basePrice - discountPrice) / basePrice) * 100)
          : '';
      }

      if (field === 'discount_percentage') {
        const percentage = numberValue(value);
        current.discount_price = basePrice > 0 && percentage > 0
          ? rounded(basePrice - (basePrice * percentage / 100))
          : '';
      }

      if (!numberValue(current.discount_price) && !numberValue(current.discount_percentage)) {
        current.start_date = '';
        current.end_date = '';
      }

      next[index] = current;
      return next;
    });
  };

  const addPrice = () => {
    setPrices(prev => [...prev, emptyProductPrice()]);
  };

  const removePrice = (index) => {
    setPrices(prev => prev.length === 1 ? prev : prev.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold leading-6 text-gray-900">Price options</h2>
        <button
          type="button"
          onClick={addPrice}
          title="Add price option"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white shadow-sm hover:bg-brown-600 focus:outline-none focus:ring-2 focus:ring-brown-600 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      {submitted && prices.length === 0 && (
        <p className="mb-2 text-xs text-red-500">At least one price option is required</p>
      )}

      <div className="space-y-3">
        {prices.map((priceOption, index) => {
          const basePrice = numberValue(priceOption.price);
          const discountDisabled = basePrice <= 0;
          const hasDiscount = numberValue(priceOption.discount_price) > 0 || numberValue(priceOption.discount_percentage) > 0;

          return (
            <div key={priceOption.id || index} className="rounded-md border border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Option {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removePrice(index)}
                  disabled={prices.length === 1}
                  title="Delete price option"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Price *</label>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={priceOption.price}
                      onChange={(e) => updatePrice(index, 'price', e.target.value)}
                      className="block h-10 w-full rounded-md border-0 py-1.5 pl-3 pr-11 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">DT</span>
                  </div>
                  {submitted && priceOption.price === '' && (
                    <p className="mt-1 text-xs text-red-500">Price is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Min qty</label>
                  <input
                    type="number"
                    min="0"
                    value={priceOption.min_qty}
                    onChange={(e) => updatePrice(index, 'min_qty', e.target.value)}
                    className="mt-2 block h-10 w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Max qty</label>
                  <input
                    type="number"
                    min="1"
                    value={priceOption.max_qty}
                    onChange={(e) => updatePrice(index, 'max_qty', e.target.value)}
                    className="mt-2 block h-10 w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Discount price</label>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      min="0"
                      max={basePrice > 0 ? Math.max(basePrice - 0.01, 0).toFixed(2) : undefined}
                      step="0.01"
                      value={priceOption.discount_price}
                      disabled={discountDisabled}
                      onChange={(e) => updatePrice(index, 'discount_price', e.target.value)}
                      className="block h-10 w-full rounded-md border-0 py-1.5 pl-3 pr-11 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">DT</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Discount %</label>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={priceOption.discount_percentage}
                      disabled={discountDisabled}
                      onChange={(e) => updatePrice(index, 'discount_percentage', e.target.value)}
                      className="block h-10 w-full rounded-md border-0 py-1.5 pl-3 pr-9 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">%</span>
                  </div>
                </div>
              </div>

              {hasDiscount && (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">Start date</label>
                    <input
                      type="date"
                      value={priceOption.start_date || ''}
                      onChange={(e) => updatePrice(index, 'start_date', e.target.value)}
                      className="mt-2 block h-10 w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">End date</label>
                    <input
                      type="date"
                      value={priceOption.end_date || ''}
                      onChange={(e) => updatePrice(index, 'end_date', e.target.value)}
                      className="mt-2 block h-10 w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
