import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import Select from 'react-select';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';

const emptyPack = {
  name_en: '',
  name_ar: '',
  name_fr: '',
  url: '',
  description_en: '',
  description_ar: '',
  description_fr: '',
  price: '',
  discount_price: '',
  discount_percentage: '',
  start_date: '',
  end_date: '',
  stock: 0,
  weight: '',
  is_new: false,
  is_featured: false,
  main_image: null,
};

const numberValue = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const moneyValue = (value) => Number(value).toFixed(2);

export default function PackForm({ auth, products, categories = [], pack = null }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState(pack?.main_image ? `/${pack.main_image}` : '/pictures/default.jpg');
  const [form, setForm] = useState({
    ...emptyPack,
    ...(pack ? {
      name_en: pack.name?.en || '',
      name_ar: pack.name?.ar || '',
      name_fr: pack.name?.fr || '',
      url: pack.url || '',
      description_en: pack.description?.en || '',
      description_ar: pack.description?.ar || '',
      description_fr: pack.description?.fr || '',
      price: pack.price || '',
      discount_price: pack.discount_price || '',
      discount_percentage: pack.discount_percentage || '',
      start_date: pack.start_date || '',
      end_date: pack.end_date || '',
      stock: pack.stock ?? 0,
      weight: pack.weight || '',
      is_new: Boolean(pack.is_new),
      is_featured: Boolean(pack.is_featured),
    } : {}),
  });
  const [selectedProducts, setSelectedProducts] = useState(
    (pack?.products || []).map((product) => ({
      product_id: product.id,
      quantity: product.pivot?.quantity || '',
      weight: product.pivot?.weight || '',
    }))
  );
  const [selectedCategories, setSelectedCategories] = useState((pack?.categories || []).map((category) => category.id));
  const [existingPictures, setExistingPictures] = useState(
    (pack?.pictures || []).map((picture) => ({
      id: picture.id,
      path: `/${picture.path}`,
      order: picture.order || 1,
    }))
  );
  const [newPictures, setNewPictures] = useState([]);

  const productOptions = useMemo(() => products.map((product) => ({
    value: product.id,
    label: product.name?.[lang] || product.name?.en,
  })), [products, lang]);

  const selectedOptions = productOptions.filter((option) =>
    selectedProducts.some((product) => product.product_id === option.value)
  );
  const categoryOptions = useMemo(() => categories.map((category) => ({ value: category.id, label: category.name?.[lang] || category.name?.fr || category.name?.en })), [categories, lang]);
  const selectedCategoryOptions = categoryOptions.filter((option) => selectedCategories.includes(option.value));
  const priceValue = numberValue(form.price);
  const discountPriceValue = numberValue(form.discount_price);
  const discountPercentageValue = numberValue(form.discount_percentage);
  const canSetDiscount = priceValue > 0;
  const hasDiscount = canSetDiscount && (discountPriceValue > 0 || discountPercentageValue > 0);
  const hasInvalidDiscount = hasDiscount && (
    discountPriceValue <= 0
    || discountPriceValue >= priceValue
    || discountPercentageValue <= 0
    || discountPercentageValue >= 100
  );

  const handleChange = (event) => {
    const { name, value, files, type, checked } = event.target;
    const nextValue = files ? files[0] : type === 'checkbox' ? checked : value;

    setForm((previous) => {
      const next = { ...previous, [name]: nextValue };

      if (name === 'price') {
        const nextPrice = numberValue(nextValue);

        if (nextPrice <= 0) {
          return {
            ...next,
            discount_price: '',
            discount_percentage: '',
            start_date: '',
            end_date: '',
          };
        }

        if (numberValue(previous.discount_percentage) > 0) {
          next.discount_price = moneyValue(nextPrice - (nextPrice * numberValue(previous.discount_percentage) / 100));
        } else if (numberValue(previous.discount_price) > 0 && numberValue(previous.discount_price) < nextPrice) {
          next.discount_percentage = moneyValue(((nextPrice - numberValue(previous.discount_price)) / nextPrice) * 100);
        }
      }

      if (name === 'discount_price') {
        const currentPrice = numberValue(previous.price);

        if (currentPrice <= 0 || value === '') {
          return {
            ...next,
            discount_price: '',
            discount_percentage: '',
            start_date: '',
            end_date: '',
          };
        }

        const currentDiscountPrice = numberValue(value);
        next.discount_percentage = currentDiscountPrice > 0 && currentDiscountPrice < currentPrice
          ? moneyValue(((currentPrice - currentDiscountPrice) / currentPrice) * 100)
          : '';
      }

      if (name === 'discount_percentage') {
        const currentPrice = numberValue(previous.price);

        if (currentPrice <= 0 || value === '') {
          return {
            ...next,
            discount_price: '',
            discount_percentage: '',
            start_date: '',
            end_date: '',
          };
        }

        const currentDiscountPercentage = numberValue(value);
        next.discount_price = currentDiscountPercentage > 0 && currentDiscountPercentage < 100
          ? moneyValue(currentPrice - (currentPrice * currentDiscountPercentage / 100))
          : '';
      }

      return next;
    });

    if (files?.[0]) {
      setPreview(URL.createObjectURL(files[0]));
    }
  };

  const handleProductsChange = (options) => {
    setSelectedProducts((options || []).map((option) => {
      const existing = selectedProducts.find((product) => product.product_id === option.value);

      return existing || { product_id: option.value, quantity: '', weight: '' };
    }));
  };

  const handlePicturesChange = (event) => {
    const files = Array.from(event.target.files || []);

    setNewPictures((previous) => {
      const allPictures = [...existingPictures, ...previous];
      const lastOrder = allPictures.length > 0
        ? Math.max(...allPictures.map((picture) => Number(picture.order) || 0))
        : 0;

      return [
        ...previous,
        ...files.map((file, index) => ({
          path: URL.createObjectURL(file),
          order: lastOrder + index + 1,
          file,
        })),
      ];
    });

    event.target.value = null;
  };

  const updateExistingPictureOrder = (pictureId, order) => {
    setExistingPictures((previous) => previous
      .map((picture) => picture.id === pictureId ? { ...picture, order: Number(order) } : picture)
      .sort((a, b) => a.order - b.order)
    );
  };

  const updateNewPictureOrder = (index, order) => {
    setNewPictures((previous) => {
      const pictures = [...previous];
      pictures[index] = { ...pictures[index], order: Number(order) };

      return pictures.sort((a, b) => a.order - b.order);
    });
  };

  const removeExistingPicture = (pictureId) => {
    setExistingPictures((previous) => previous.filter((picture) => picture.id !== pictureId));
  };

  const removeNewPicture = (indexToRemove) => {
    setNewPictures((previous) => previous.filter((_, index) => index !== indexToRemove));
  };

  const updateProductMeta = (productId, key, value) => {
    setSelectedProducts((previous) => previous.map((product) =>
      product.product_id === productId ? { ...product, [key]: value } : product
    ));
  };

  const removeProduct = (productId) => {
    setSelectedProducts((previous) => previous.filter((product) => product.product_id !== productId));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (hasInvalidDiscount) {
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, typeof value === 'boolean' ? (value ? 1 : 0) : value);
      }
    });

    selectedProducts.forEach((product, index) => {
      formData.append(`products[${index}][product_id]`, product.product_id);

      if (product.quantity !== '') {
        formData.append(`products[${index}][quantity]`, product.quantity);
      }

      if (product.weight !== '') {
        formData.append(`products[${index}][weight]`, product.weight);
      }
    });
    selectedCategories.forEach((categoryId) => formData.append('categories[]', categoryId));

    existingPictures.forEach((picture) => {
      formData.append('existing_pictures[]', picture.id);
      formData.append(`existing_pictures_order[${picture.id}]`, picture.order);
    });

    newPictures.forEach((picture, index) => {
      formData.append(`pictures[${index}]`, picture.file);
      formData.append(`pictures_order[${index}]`, picture.order);
    });

    router.post(
      pack ? `/admin/catalog/packs/update/${pack.id}` : '/admin/catalog/packs',
      formData,
      { forceFormData: true }
    );
  };

  const productName = (productId) => {
    const product = products.find((item) => item.id === productId);

    return product?.name?.[lang] || product?.name?.en || 'Product';
  };

  return (
    <AdminLayout user={auth?.user}>
      <div className="mb-6">
        <h1 className="text-base font-semibold leading-6 text-gray-900">{pack ? 'Edit Pack' : 'New Pack'}</h1>
        <p className="mt-2 text-sm text-gray-700">Create gift packs and define the products included in each pack.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">Main image *</label>
          <div className="mt-2 flex items-center gap-x-4">
            <img src={preview} alt="Preview" className="h-28 w-28 rounded-lg object-cover" />
            <div className="relative">
              <button type="button" className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
                Choose image
              </button>
              <input type="file" name="main_image" onChange={handleChange} className="absolute inset-0 cursor-pointer opacity-0" />
            </div>
            {submitted && !pack && !form.main_image && <p className="text-xs text-red-500">Please choose an image</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">Pack pictures</label>
          <div className="mt-2 flex flex-wrap items-start gap-4">
            {existingPictures.map((picture) => (
              <PicturePreview
                key={picture.id}
                picture={picture}
                onRemove={() => removeExistingPicture(picture.id)}
                onOrderChange={(order) => updateExistingPictureOrder(picture.id, order)}
              />
            ))}

            {newPictures.map((picture, index) => (
              <PicturePreview
                key={`${picture.path}-${index}`}
                picture={picture}
                onRemove={() => removeNewPicture(index)}
                onOrderChange={(order) => updateNewPictureOrder(index, order)}
              />
            ))}

            <div className="relative">
              <button type="button" className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
                Choose pictures
              </button>
              <input
                type="file"
                name="pictures"
                multiple
                onChange={handlePicturesChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['name_en', 'Name EN', 'Pack name'],
            ['name_ar', 'Name AR', 'اسم الباقة'],
            ['name_fr', 'Name FR', 'Nom du pack'],
          ].map(([name, label, placeholder]) => (
            <div key={name}>
              <label className="block text-sm font-medium leading-6 text-gray-900">{label} *</label>
              <input
                type="text"
                name={name}
                dir={name === 'name_ar' ? 'rtl' : 'ltr'}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm"
              />
              {submitted && form[name] === '' && <p className="mt-1 text-xs text-red-500">Required</p>}
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Input name="url" label="URL" value={form.url} onChange={handleChange} placeholder="auto-generated if empty" />
          <Input name="price" label="Price *" value={form.price} onChange={handleChange} type="number" step="0.01" />
          <Input name="stock" label="Stock *" value={form.stock} onChange={handleChange} type="number" step="1" />
          <Input name="weight" label="Pack weight *" value={form.weight} onChange={handleChange} type="number" step="0.01" />
        </div>

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">Pack categories</label>
          <Select className="mt-2" options={categoryOptions} value={selectedCategoryOptions} isMulti onChange={(options) => setSelectedCategories((options || []).map((option) => option.value))} />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="discount_price"
              label="Discount price"
              value={form.discount_price}
              onChange={handleChange}
              type="number"
              step="0.01"
              min="0"
              max={canSetDiscount ? Math.max(priceValue - 0.01, 0) : undefined}
              disabled={!canSetDiscount}
              placeholder={canSetDiscount ? 'Set discount price' : 'Set price first'}
            />
            <Input
              name="discount_percentage"
              label="Discount %"
              value={form.discount_percentage}
              onChange={handleChange}
              type="number"
              step="0.01"
              min="0"
              max="99.99"
              disabled={!canSetDiscount}
              placeholder={canSetDiscount ? 'Set discount percentage' : 'Set price first'}
            />
          </div>
          {!canSetDiscount && (
            <p className="mt-2 text-xs text-gray-500">Discount is available after setting a price greater than 0.</p>
          )}
          {hasInvalidDiscount && (
            <p className="mt-2 text-xs text-red-500">Discount price must be greater than 0 and less than the pack price.</p>
          )}
          {hasDiscount && !hasInvalidDiscount && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Input name="start_date" label="Start date" value={form.start_date} onChange={handleChange} type="date" />
              <Input name="end_date" label="End date" value={form.end_date} onChange={handleChange} type="date" />
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Textarea name="description_en" label="Description EN" value={form.description_en} onChange={handleChange} />
          <Textarea name="description_ar" label="Description AR" value={form.description_ar} onChange={handleChange} dir="rtl" />
          <Textarea name="description_fr" label="Description FR" value={form.description_fr} onChange={handleChange} />
        </div>

        <div className="flex gap-x-6">
          <Checkbox name="is_featured" label="Featured" checked={form.is_featured} onChange={handleChange} />
          <Checkbox name="is_new" label="New" checked={form.is_new} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">Products in this pack</label>
          <div className="mt-2">
            <Select options={productOptions} value={selectedOptions} isMulti onChange={handleProductsChange} />
          </div>

          {selectedProducts.length > 0 && (
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-900">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Weight</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedProducts.map((product) => (
                    <tr key={product.product_id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{productName(product.product_id)}</td>
                      <td className="px-4 py-3">
                        <input type="number" min="0" step="1" value={product.quantity} onChange={(event) => updateProductMeta(product.product_id, 'quantity', event.target.value)} className="w-28 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" min="0" step="0.01" value={product.weight} onChange={(event) => updateProductMeta(product.product_id, 'weight', event.target.value)} className="w-28 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button type="button" onClick={() => removeProduct(product.product_id)} className="text-red-700">
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button type="submit" className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brown-600">
            {pack ? 'Update Pack' : 'Create Pack'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      <input {...props} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm" />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      <textarea {...props} rows={4} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brown-600 sm:text-sm" />
    </div>
  );
}

function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-center gap-x-2 text-sm font-medium text-gray-900">
      <input {...props} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brown-600 focus:ring-brown-600" />
      {label}
    </label>
  );
}

function PicturePreview({ picture, onRemove, onOrderChange }) {
  return (
    <div>
      <div className="relative">
        <img src={picture.path} alt="Pack" className="h-28 w-28 rounded-lg object-cover" />
        <button type="button" onClick={onRemove} className="absolute right-2 top-2 rounded-full bg-white p-1 shadow">
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
      <input
        type="number"
        min="1"
        value={picture.order}
        onChange={(event) => onOrderChange(event.target.value)}
        className="mt-1 w-20 rounded border px-2 py-1 text-sm"
      />
    </div>
  );
}
