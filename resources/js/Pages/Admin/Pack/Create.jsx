import PackForm from '@/Components/admin/PackForm';

export default function Create({ auth, products }) {
  return <PackForm auth={auth} products={products} />;
}
