import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Onboarding from '../components/Onboarding';

import splashImage from '../assets/packback-splash.png';

function SplashPage () {
    
    //Set variable to "navigate" to the next component
    const navigate = useNavigate();

    const [showOnboarding, setShowOnboarding] = useState(false);

    //useEffect will execute a timeout after which the component will navigate to the /login component.
    useEffect(() =>{
        const timer = setTimeout(() => {


            const onboardingDone = localStorage.getItem("onboardingDone");
            
            if(onboardingDone) {
                //Already seen the onboarding, goes to the login
                navigate('/login');
            } else {
                //first access = show onboarding
            setShowOnboarding(true);
            }
        },2100);
    return () => clearTimeout(timer);
    }, [navigate]); 

    const handleOnboardingComplete = () => {
        //onboarding done navigate to the login
        navigate('/login');
    };
    
//The SplashPage only contains the image
    return (
        <>
        <div className="splash-page">
        <div class="loader"></div>
                <img
                className="splash-image"
                src={splashImage}
                alt="packback sustainable shop"
            />
        </div>
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
        </>
    );
}


export default SplashPage;