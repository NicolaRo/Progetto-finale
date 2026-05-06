//Import createContext to set component's state between non relative files
import { createContext, useState} from "react";

//Save the cart state 
const CartContext = createContext();

//the function CartProvider 
function CartProvider({children}) {
    const [cart, setCart] = useState([]);

    //addToCart store the selected products and userData 
    const addToCart = (product) => {
    
        setCart([...cart, product]);
    };

    //removeFromCart will remove selected products from the cart
    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item._id !== productId));
    };

    //clearCart remove the selected products from the cart
    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{cart, addToCart, removeFromCart, clearCart}}>
        {children}
        </CartContext.Provider>
    );
}

export {CartContext, CartProvider}; 
