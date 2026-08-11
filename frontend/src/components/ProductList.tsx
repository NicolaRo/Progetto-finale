import ProductCard, { Product } from '../components/ProductCard';

interface ProductListProps {
  products: Product[];
}

function ProductList({ products }: ProductListProps) {
  if (!products || !Array.isArray(products)) return null;

  const productItems = products.map((product) => (
    <ProductCard key={product._id} product={product} />
  ));

  return (
    <>
      <div className="product-list-container">
        <h3 className="container-title text-h2">Recently added products:</h3>
        <div className="singleItem">

          {productItems}
        </div>
      </div>
    </>
  )
}

export default ProductList;