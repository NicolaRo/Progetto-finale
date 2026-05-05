function ProductList({products}) {

    const productItems = products.map((product)=> {
    
        return(
            <div className="product-card"
            key= {product.name}>
                <img
                className="product-listed-preview"
                src={`https://img.spoonacular.com/ingredients_100x100/${product.image}`}
                alt={product.name}
              />
              <p>{product.name}</p>
                <p>{product.description}</p>
                <p>{product.price}€/</p>
                <p>{product.unit}</p>
                <p>{product.quantity} {product.unit}</p>
                <p>{product.producerId.name}</p>
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