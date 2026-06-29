import PackForm from '@/Components/admin/PackForm';

export default function Edit({ auth, products, pack }) {
  return <PackForm auth={auth} products={products} pack={pack} />;
}
