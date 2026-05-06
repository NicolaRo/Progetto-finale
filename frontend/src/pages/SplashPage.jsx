import {useEffect} from 'react';
import {useNavigate} from "react-router-dom";

import splashImage from '../assets/packback-splash.png';

function SplashPage () {
    
    //Set variable to "navigate" to the next component
    const navigate = useNavigate();

    //useEffect will execute a timeout after which the component will navigate to the /login component.
    useEffect(() =>{
        setTimeout(()=> {
            navigate('/login');
        }, 2100);
    }, [navigate]); 
    
//The SplashPage only contains the image
    return (
        <>
        <div className="splash-page">
        <div className="loader"></div>
                <img
                className="splash-image"
                src={splashImage}
                alt="packback sustainable shop"
            />
        </div>
        </>
    );
}


export default SplashPage;