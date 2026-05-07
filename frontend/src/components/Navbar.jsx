import {useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import { CartContext } from '../context/CartContext';

import placeholderImg from '../assets/placeholderImg.png';
import ShoppingCart from '../assets/shopping-cart.png';
import FullShoppingCart from '../assets/full-shopping-cart.png';
import LogoutIcon from '../assets/logout-icon.png';

function Navbar ({ setShowCart }) {

    const {cart} = useContext(CartContext);
    const {user} = useContext(AuthContext);
    const navigate = useNavigate ();


    return (
        <> 
        
        <div className="navbar">
        <h4 className="account-name"> {user ? `Benvenut@: ${user.name}`: "Caricamento..."}</h4>
            <div className="PP-container">
            <img
                className="PP-image"
                src={placeholderImg}
                alt="packback sustainable shop"
            />
            </div>
            
            <button 
                className="btn-logout"
                onClick={() => {
                navigate('/login')
            }}><img 
                className="account-logout-icon"
                src={LogoutIcon}
                alt="log out"/>log out
            </button>

            <button className="cart-btn" onClick={() => setShowCart(true)}>
                <img 
                    className="cart-icon"
                    src={cart.length > 0 ? FullShoppingCart : ShoppingCart}
                    alt="Cart"
                />
            </button>
            </div>
        </>
    );
}

export default Navbar;