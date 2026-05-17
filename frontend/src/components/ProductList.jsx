import ProductCard from '../components/ProductCard';

function ProductList({products}) {

    const productItems = products.map((product)=> (
        <ProductCard key={product._id} product={product}/>
    ));
    if (!products || !Array.isArray(products)) return null;

    return (
        <>
        <div className="product-list-container">
        <h3 className="container-title">Recently added products:</h3>
            <div className="singleItem">
                
                {productItems}
            </div>
        </div>
        </>
    )
}

export default ProductList;