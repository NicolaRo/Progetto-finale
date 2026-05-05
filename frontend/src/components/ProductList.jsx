import ProductCard from '../components/ProductCard';

function ProductList({products}) {

    const productItems = products.map((product)=> (
        <ProductCard key={product._id} product={product}/>
    ));

    return (
        <>
        <div className="product-list-container">
            <div className="singleItem">
                {productItems}
            </div>
        </div>
        </>
    )
}

export default ProductList;