import PackForm from '@/Components/admin/PackForm';

export default function Create({ auth, products, categories }) {
  return <PackForm auth={auth} products={products} categories={categories} />;
}
