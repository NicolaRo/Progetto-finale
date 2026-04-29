import {auth} from '../services/firebaseConfig';
import {useState} from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';



function LoginPage() {
    const [showLogin, setShowLogin] = useState(true);
    const [showUser, setShowUser] = useState(true);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");

    const provider = new GoogleAuthProvider();

    //Function to enable google login popup
    const handleLogIn = async () => {
        const result = await signInWithPopup(auth, provider);
        console.log(result.user);
    }
    
    return (
        <>
        {/*Toggle to activate sign in form (default is the login screen) */}
        <button 
            className="toogle-login"
            onClick={() => {
                setShowLogin(!showLogin);
            }}> 
            Sign In
        </button>
        {showLogin ? (
            <div className="login-container">
                <h3 className="container-title">Log In</h3>
                <button
                    className="btn-google-auth"
                    onClick={handleLogIn}> Log In
                </button>
        </div>
        ) : (
            <div className="signin-container">
                <h3 className="container-title">Sign In</h3>
                
                <div className="img-container">
                <img 
                    className="imgage"
                    src="placeholder-img.png"
                    alt="illustration"
                />
                </div>
                <input 
                className="input-text"
                type="text"
                value={name}
                onChange={(e)=> setName(e.target.value)}
                placeholder="I.e.: John"
                />
                <input 
                    className="input-text"
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="I.e.: Doe"
                />
                <input 
                    className="input-text"
                    type="text"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    placeholder="I.e.: john.doe@example.com"
                />
            </div>
            
        )}
        <button 
                className="toogle-user"
                onClick={() => {
                    setShowUser(!showUser);
                }}> 
                User
            </button>
        
        </>
    );
}

export default LoginPage;