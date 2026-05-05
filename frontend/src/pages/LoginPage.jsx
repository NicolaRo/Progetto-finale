import {auth} from '../services/firebaseConfig';
import {useState, useContext} from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import googleLogin from '../assets/googleLogin.png';

function LoginPage() {
    const [showLogin, setShowLogin] = useState(true);
    const [showRole, setShowRole] = useState(true);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");

    const provider = new GoogleAuthProvider();

    const {login} = useContext(AuthContext);

    const navigate = useNavigate();

    //Function to enable google login popup
    const googleLogIn = async () => {
        const result = await signInWithPopup(auth, provider);

        //Fetch data to the backend
      const googleAuth = await fetch(`${import.meta.env.VITE_API_URL}/api/users/google-login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email: result.user.email })
      })
      console.log(googleAuth.status);

      //Read the data
      const logInData = await googleAuth.json();
      login(logInData.token, {role: logInData.role, name: logInData.name});

      console.log(logInData)

      //Navigate to specific page depending on the role
      if (logInData.role === "Producer") {
        navigate('/ProducerHome');
    } else {
        if(logInData.role === "User") {
            navigate('/UserHome');
        }
    }
    }
    //Function to log in with own credentials
    const handleLogIn =  async (e) => {
        e.preventDefault();

        //Object with credentials to pass to the backend when loggin in an existing user
        const data = {
            email: email,
            password: password
          }

        // Validations
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })

      //Read the data
      const logInData = await response.json();
      login(logInData.token, {role: logInData.role, name: logInData.name});

      console.log(logInData)


      //Navigate to specific page depending on the role
      if (logInData.role === "Producer") {
        navigate('/ProducerHome');
    } else {
        if(logInData.role === "User") {
            navigate('/UserHome');
        }
    }

    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();

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

      //Object with Account details to pass to the backend when registering a new user
      const data = {
        email: email,
        password: password,
        name: name,
        surname: surname,
        role: role
      }

      //Fetch data to the backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })

      if (response.ok) {
        navigate('/login');
        alert('Account created successfully, log in to access')
        
    } else {
        const error = await response.json();
        alert(error.message);
    }
    
    }
    
    return (
        <>
        
        
        {showLogin ? (
            
            <div className="login-container">
                <h3 className="container-title">Welcome in PackBack</h3>
                <h6 className="container-subtitle">Reuseable packagin for a greener world</h6>
                
                <input 
                    className="input-text"
                    type="email"
                    aria-label="email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    placeholder="your@email.com"
                />
                <input 
                    className="input-text"
                    type="password"
                    value={password}
                    minlength="8"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a password"
                />
                <div className="login-buttons-container">
                <button 
                    className="login-btn"
                    type="submit-btn"
                    onClick={handleLogIn}>
                    Log In
                </button>

                <button
                    className="btn-google-auth"
                    placeholder="login with Google"
                    onClick={googleLogIn}>
                    <img
                    className="btn-icon"
                    src={googleLogin.png}
                    alt="login with google"></img>
                </button>
                </div>
                

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
                    minLength="8"
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
                
                <button 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    onClick={() => {
                        setShowRole(!showRole);
                        setRole(showRole ? "Producer" : "User");
                    }}> {showRole ? "I am a User" : "I am a Producer"}
                </button>

                {showRole ? <p>An User can buy products allowing packaging reuse</p> : <p>A Producer can sell products</p>}
                
                <button type="submit"
                    onClick={handleSubmit}>
                    Register
                </button>
            </div>
            
        )}

        {/*Toggle to activate sign in form (default is the login screen) */}
        <button 
            className="toogle-login"
            onClick={() => {
                setShowLogin(!showLogin);
            }}> 
            Sign In
        </button>
        
        </>
    );
}

export default LoginPage;