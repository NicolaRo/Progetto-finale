import {useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';

import placeholderImg from '../assets/placeholderImg.png';

function Navbar () {

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
            
            <button className="btn-logout"
            onClick={() => {
                navigate('/login')
            }}>Log out
            </button>
        </div>
        </>
    );
}

export default Navbar;