import { auth } from "../services/firebaseConfig";
import { useState, useContext } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import googleLogin from "../assets/googleLogin.png";

import {EyeIcon} from "../components/icons/Icons";

import Account from "../assets/account-icon.png";
import ForgotPassword from "./ForgotPassword";
import RoleModal from "../components/RoleModal";

function LoginPage() {
  const[showLogin, setShowLogin] = useState(true);

  const[name, setName] = useState("");
  const[surname, setSurname] = useState("");
  const[email, setEmail] = useState("");
  const[role, setRole] = useState("User");
  const[password, setPassword] = useState("");

  const[errors, setErrors] = useState({});

  const[showPassword, setShowPassword] = useState(false);
  const[googleUserData, setGoogleUserData] = useState(null);
  const[showRoleModal, setShowRoleModal] = useState (false);

  const[showForgotPassword, setShowForgotPassword] = useState(false);

  const[showToast, setShowToast] = useState(false);

  const provider = new GoogleAuthProvider();

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  //Function to enable google login popup
  const googleLogIn = async () => {
    
    const result = await signInWithPopup(auth, provider);

    const googleEmail = result.user.email;
    const googleName = result.user.displayName; // Firebase will share the User Name
    
    //1. Check if the email already exist
    const checkResponse = await fetch( `${import.meta.env.VITE_API_URL}/api/users/check-email`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: googleEmail}),
      }
    );

    const checkData = await checkResponse.json();

    if(!checkData.exists) {
      
      setGoogleUserData ({email: googleEmail, name: googleName});
      setShowRoleModal (true);
      return;
    }

    await completeGoogleLogin(googleEmail, googleName, null);
  };

  const completeGoogleLogin = async (email, name, role) => {
    const googleAuth = await fetch (
      `${import.meta.env.VITE_API_URL}/api/users/google-login`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, name, role}),
      }
    );
    
    const logInData = await googleAuth.json();
    login(
      logInData.token,
      {
      role: logInData.role,
      name: logInData.name,
      _id: logInData._id,
      }
    );

    if (logInData.role === "Producer") {
      navigate("/ProducerHome");
    } else {
      navigate("/UserHome");
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
      setErrors({email: "Please provide a valid e-mail address."});
      return;
    }
    if (password.length < 8) {
      setErrors({password: "The password must be of minimum 8 digits."});
      return;
    }

    setErrors({});

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

    if (!response.ok) {
    setErrors({auth: "Invalid credentials, please try again"})
    return};

    login(logInData.token, {
      role: logInData.role,
      name: logInData.name,
      _id: logInData._id,
    });

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
      setErrors({name: "Name lenght must be at least 2 digits."});
      return;
    }
    if (surname.length < 2) {
      setErrors({surname: "surname lenght must be at least 2 digits."});
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrors({email: "Please provide a valid e-mail address."});
      return;
    }
    if (password.length < 8) {
      setErrors({password: "The password must be of minimum 8 digits."});
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
      setShowLogin(true);
      setShowToast(true);
    } else {
      const error = await response.json();
      setErrors(error.message);
    }
  };

  return (
    <>
    {showToast && (
      <div className="toast-account-registration">
        <p>Well done! Your account has been registered succesfully. Log in to start.</p>
      </div>
    )}
      {showLogin ? (
        <div className="login-container">
          <h3 className="container-title text-h1">Welcome in PackBack</h3>

          <h4 className="container-subtitle text-subtitle">
            Reusable packaging for a greener world
          </h4>

          {errors.auth && <div className="error-banner text-body">{errors.auth}</div>}

          <div className="google-login-container">
            <button
              className="btn-google-auth"
              placeholder="login with Google"
              onClick={googleLogIn}
            >
              <img
                className="icon-google-login"
                src={googleLogin}
                alt="login with google"
              />
            </button>
          </div>

          <p>Or log in with your credentials</p>
          <div className="input-container">
            <label className="label text-label" htmlFor="email">
              Email
            </label>
            <input
              className="input-text"
              id="email"
              type="email"
              aria-label="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}

            <label className="label text-label" htmlFor="password">
              Password
            </label>
            <input
              className="input-text"
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              minLength="8"
              placeholder="Choose a password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogIn(e);
              }}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
            <button
              className="show-pwd-btn btn btn--ghost"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show password"}
              <EyeIcon className="icon-show-pwd" size={16} />
            </button>
            <button
              className="forgot-pwd-btn"
              onClick={() => setShowForgotPassword(!showForgotPassword)}
            >
              {" "}
              Forgot password?
            </button>
            {showForgotPassword && <ForgotPassword />}
          </div>
          <div className="login-buttons-container">
            <button className="login-btn btn btn--primary" type="submit" onClick={handleLogIn}>
              Log In
            </button>
          </div>
        </div>
      ) : (
        <div className="signin-container">
          <div className="signup-img-container">
            <h3 className="container-title text-h1">Sign Up</h3>
            <img className="account-icon" src={Account} alt="Account icon" />
          </div>

          <div className="role-selection-container text-h2">
            <h3 className="text-h2">Choose your account type:</h3>
          </div>

<div className="role-cards">
  <div
    className={`role-card ${role === "User" ? "active" : ""}`}
    onClick={() => setRole("User")}
  >
    <span className="role-card-icon">🛒</span>
    <h3 className="text-card-title">User</h3>
    <p className="text-body">Buy products from local producers and get them in reusable containers.</p>
  </div>

  <div
    className={`role-card ${role === "Producer" ? "active" : ""}`}
    onClick={() => setRole("Producer")}
  >
    <span className="role-card-icon">🌱</span>
    <h3 className="text-card-title">Producer</h3>
    <p className="text-body">Sell your products and ship them with our reusable packaging.</p>
  </div>
</div>
        
          <div className="input-containers">
            <div className="input-name-container">
              <label className="label" htmlFor="name">
                Name
              </label>
              <input
                className="input-text"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="I.e.: John"
              />
            </div>
            {errors.name && <span className="error-text">{errors.name}</span>}

            <div className="input-surname-container">
              <label className="label" htmlFor="surname">
                Surname
              </label>
              <input
                className="input-text"
                id="surname"
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="I.e.: Doe"
              />
            </div>
            {errors.surname && <span className="error-text">{errors.surname}</span>}

            <div className="input-pwd-container-btn">
              <div className="input-email-container">
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input
                  className="input-text"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="I.e.: john.doe@example.com"
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}

              <div className="input-container">
                <label className="label" htmlFor="password">
                  Password
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
                {errors.password && <span className="error-text">{errors.password}</span>}
                <button
                  className="show-pwd-btn btn btn--ghost"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show password"}
                  <EyeIcon className="icon-show-pwd" size={16} />
                </button>
              </div>
            </div>
          </div>

          <button className="register-btn btn btn--primary" type="submit" onClick={handleSubmit}>
            Register
          </button>
        </div>
      )}

      {/*Toggle to activate sign in form (default is the login screen) */}
      <div className="signUp-container">
        <div className="signup-text">
          {showLogin ? (
            <div className="join-us-claim">
              <h4 className="text-h2">Not a member yet?</h4>
              <br></br>
              <p className="text-body">Join our community and become part of the changing world</p>
            </div>
          ) : (
            <div className="join-us-claim">
              <h4>PackBack</h4>
              <br></br>
              <p>Sustainable shopping for a greener world</p>
            </div>
          )}
        </div>
        <button
          className="toogle-login btn btn--primary"
          onClick={() => {
            setShowLogin(!showLogin);
          }
        }
        >
          {showLogin ? "Sign Up" : "Back to login"}
        </button>

        {showRoleModal && (
          <RoleModal
            isOpen = {showRoleModal}
            userName = {googleUserData.name}
            onClose = {() => setShowRoleModal(false)}
            onChooseRole = {async (choosenRole) => {
                setShowRoleModal (false);
                await completeGoogleLogin(googleUserData.email, googleUserData.name, choosenRole);
              }}
            />
          )}
      </div>
    </>
  );
}

export default LoginPage;
