import {useContext} from 'react';
import { AuthContext } from '../../context/AuthContext';
import {useState} from 'react';
import Navbar from '../../components/Navbar';


function ProducerHome () {
    
    const {token} = useContext(AuthContext);

    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productType, setProductType] = useState(null);
    const [productQuantity, setProductQuantity] = useState ("");
    const [productUnit, setProductUnit] = useState("");

    

    const handleCreateProduct = async (e) => {
        e.preventDefault();

        if (!productName || !productDescription || !productType || !productPrice || !productQuantity || !productUnit)
            {alert("Please provide all the product's details.")
            return;
    } else {
        //Fetch data to the backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({name: productName, type: productType, quantity: productQuantity, unit: productUnit, price: productPrice, description: productDescription})
      })
      if(response.ok) {
        alert("Product created");
      }
    } }
    return (
        <>
        <h3 className="page-title"> Producer Home</h3>
        <Navbar />
        <div className="create-product-container">
            <h3 className="component-title">Add a new product</h3>
            
            <input className="input"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Product's name"
            ></input>

            <input className="input"
            type="text"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            placeholder="Product type"
            ></input>

            <input className="input"
            type="text"
            value={productDescription}
            placeholder="Product short description"
            minLength="10"
            onChange={(e) => setProductDescription(e.target.value)}
            />
            <input className="input"
            type="number"
            value={productPrice}
            placeholder="1,00€"
            minLength="10"
            onChange={(e) => setProductPrice(e.target.value)}
            />
            
            <input className="input"
            type="quantity"
            value={productQuantity}
            placeholder="10"
            onChange={(e)=> setProductQuantity(e.target.value)} 
            />
            
            <input className="input"
            type="unit"
            value={productUnit}
            placeholder="Unit"
            onChange={(e)=> setProductUnit(e.target.value)}
            />

            <button type="submit"
                onClick={handleCreateProduct}>
                Add a new product
            </button>
        </div>
        </>
    );
}


export default ProducerHome;