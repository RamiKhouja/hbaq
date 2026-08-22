import PackForm from '@/Components/admin/PackForm';

export default function Edit({ auth, products, categories, pack }) {
  return <PackForm auth={auth} products={products} categories={categories} pack={pack} />;
}
