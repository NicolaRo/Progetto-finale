import {useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';


function Navbar () {

    const {user} = useContext(AuthContext);
    const navigate = useNavigate ();

    return (
        <>
        <div className="navbar">
            <div className="PP-container">
                <img 
                    className="profile-picture"
                    src= "placeholder-img"
                    alt="profile picture icon"
                />
            </div>
            <h4 className="account-name"> {user ? `Benvenut@: ${user.name}`: "Caricamento..."}</h4>
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