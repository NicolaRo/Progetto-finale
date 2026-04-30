import {auth} from '../services/firebaseConfig';
import {useState} from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';



function LoginPage() {
    const [showLogin, setShowLogin] = useState(true);
    const [showUser, setShowUser] = useState(true);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    const data = {name, surname, email, user, password};

    const provider = new GoogleAuthProvider();

    //Function to enable google login popup
    const handleLogIn = async () => {
        const result = await signInWithPopup(auth, provider);
        console.log(result.user);
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const name = e.target.name.value.trim();
      const email = e.target.email.value.trim();
      const password = e.target.password.value.trim();
  
      // Validations
      if (name.length < 2) {
        alert("Name lenght must be at least 2 digits.");
        return;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert("Please provide a valid e-mail address.");
        return;
      }
      if (password.length < 8) {
        alert("The password must be of minimum 8 digits.");
        return;
      }

      //Fetch data to the backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
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
                <input 
                    className="input-text"
                    type="email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    placeholder="I.e.: john.doe@example.com"
                />
                <input 
                    className="input-text"
                    type="password"
                    value={password}
                    minlength="8"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a password"
                />
                
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
                    type="password"
                    value={password}
                    minlength="8"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a password"
                />
                <input 
                    className="input-text"
                    type="email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    placeholder="I.e.: john.doe@example.com"
                />
                {/*toggle button to choose which profile to register with */}
                <button onClick={ () => setShowUser(!showUser)}>
                    {showUser ? "I am an User" : "I am a Producer"}
                </button>
                {showUser ? <p>An User can buy products allowing packaging reuse</p> : <p>A Producer can sell products</p>}
                
                <button type="submit"
                    onClick={() => {
                        handleSubmit(fetch);
                    }}>
                    Register
                </button>
            </div>
            
        )}
        
        
        </>
    );
}

export default LoginPage;