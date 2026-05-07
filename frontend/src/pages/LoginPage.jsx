import { auth } from "../services/firebaseConfig";
import { useState, useContext } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import googleLogin from "../assets/googleLogin.png";
import ShowPassword from "../assets/show-password.png";
import Account from '../assets/account-icon.png';

function LoginPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [showRole, setShowRole] = useState(true);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const provider = new GoogleAuthProvider();

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  //Function to enable google login popup
  const googleLogIn = async () => {
    const result = await signInWithPopup(auth, provider);

    //Fetch data to the backend
    const googleAuth = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/google-login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: result.user.email }),
      }
    );
    console.log(googleAuth.status);

    //Read the data
    const logInData = await googleAuth.json();
    login(logInData.token, { role: logInData.role, name: logInData.name });

    console.log(logInData);

    //Navigate to specific page depending on the role
    if (logInData.role === "Producer") {
      navigate("/ProducerHome");
    } else {
      if (logInData.role === "User") {
        navigate("/UserHome");
      }
    }
  };
  //Function to log in with own credentials
  const handleLogIn = async (e) => {
    e.preventDefault();

    //Object with credentials to pass to the backend when loggin in an existing user
    const data = {
      email: email,
      password: password,
    };

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
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    //Read the data
    const logInData = await response.json();
    login(logInData.token, { role: logInData.role, name: logInData.name, id: logInData.id });

    console.log(logInData);

    //Navigate to specific page depending on the role
    if (logInData.role === "Producer") {
      navigate("/ProducerHome");
    } else {
      if (logInData.role === "User") {
        navigate("/UserHome");
      }
    }
  };

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
      role: role,
    };

    //Fetch data to the backend
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      navigate("/login");
      alert("Account created successfully, log in to access");
    } else {
      const error = await response.json();
      alert(error.message);
    }
  };

  return (
    <>
      {showLogin ? (
        <div className="login-container">
          
          <h3 className="container-title">Welcome in PackBack</h3>
          
          <h6 className="container-subtitle">
            Reuseable packagin for a greener world
          </h6>

        <div className="google-login-container">
            <button
              className="btn-google-auth"
              placeholder="login with Google"
              onClick={googleLogIn}
            >
              <img
                className="icon-google-login"
                src={googleLogin}
                alt="login with google"/>
            </button>
        </div>
          
            <p >
            ------ Or log in with your credentials ------
          </p>
          <div className="input-container">
            <label className="label"
                htmlFor="email">Email</label>
          <input
            className="input-text"
            id="email"
            type="email"
            aria-label="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
            </div>
          
        <div className="input-container--btn">
            <label className="label"
                htmlFor="password">Password</label>
            <input
                className="input-text"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                minLength="8"
                placeholder="Choose a password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                className="show-pwd-btn"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? "Hide" : "Show password"}
                <img
                className="icon-show-pwd"
                src={ShowPassword}
                alt="show/hide password"
                />
            </button>
        </div>
          
          

          <div className="login-buttons-container">
            <button className="login-btn" type="submit" onClick={handleLogIn}>
              Log In
            </button>
          </div>
        </div>
      ) : (
        <div className="signin-container">
          <h3 className="container-title">Sign Up</h3>

          <div className="img-container">
            <img
              className="account-icon"
              src={Account}
              alt="Account icon"
            />
          </div>

          <div className="input-container">
            <label className="label"
                htmlFor="name">Name</label>
          <input
            className="input-text"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="I.e.: John"
          />
          </div>

          <div className="input-container">
            <label className="label" 
                htmlFor="surname">Surname</label>
          <input
            className="input-text"
            id="surname"
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="I.e.: Doe"
          />
            </div>

            <div className="input-container-btn">
                <div className="input-container">
                <label className="label"
                htmlFor="password">Password
                </label>
                <input
                    className="input-text"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    minLength="8"
                    placeholder="Choose a password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            
           <button
            className="show-pwd-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show password"}
            <img
              className="icon-show-pwd"
              src={ShowPassword}
              alt="show/hide password"
            />
          </button>
            </div>
            
         

          <div className="input-container">
            <label className="label"
                htmlFor="email">Email</label>
          <input
            className="input-text"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="I.e.: john.doe@example.com"
          />
          </div>
          
          {/*toggle button to choose which profile to register with */}
     {/*     <div class="checkbox-wrapper-35">
  <input value="private" name="switch" id="switch" type="checkbox" class="switch">
  <label for="switch">
    <span class="switch-x-text">This is </span>
    <span class="switch-x-toggletext">
      <span class="switch-x-unchecked"><span class="switch-x-hiddenlabel">Unchecked: </span>Off</span>
      <span class="switch-x-checked"><span class="switch-x-hiddenlabel">Checked: </span>On</span>
    </span>
  </label>
</div> */}
    
    <div className="role-selection-container">
        
        <button
            className="toogle-role-btn"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onClick={() => {
              setShowRole(!showRole);
              setRole(showRole ? "Producer" : "User");
            }}
          >
            {" "}
            {showRole ? "I am a User" : "I am a Producer"}
        </button>

          {showRole ? (
            <p>An User can buy products allowing packaging reuse</p>
          ) : (
            <p>A Producer can sell products</p>
          )}

    </div>
          
          <button 
            className="register-btn"
            type="submit" 
            onClick={handleSubmit}>
            Register
          </button>
        </div>
      )}

      {/*Toggle to activate sign in form (default is the login screen) */}
      <div className="signUp-container">
        <h6>Become part of the changing world</h6>





   






      <button
        className="toogle-login"
        onClick={() => {
          setShowLogin(!showLogin);
        }}
      >
        Sign In
      </button>
      </div>
      
    </>
  );
}

export default LoginPage;
