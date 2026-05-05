function ProductList({products}) {

    const productItems = products.map((product)=> {
    
        return(
            <div key= {product.name}>
                <p>{product.producerId.name}</p>
                <p>{product.name}</p>
                <p>{product.description}</p>
                <p>{product.price}</p>
                <p>{product.unit}</p>
                <p>{product.quantity}</p>
                <img
                src={`https://img.spoonacular.com/ingredients_100x100/${product.image}`}
                alt={product.name}
              />
              <p>{product.producerId ? product.producerId.name : "Unknown producer"}</p>
            </div>
            
            
        )
        
    })


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