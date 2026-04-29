import { useState } from "react";
import { useDispatch } from "react-redux";


//Component's main function
function SignInForm() {

  //Component's state
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  //sub-component's states
  const [signIn, setSignInOpen] = useState(false);

  return (
    <>
    <button className={`button ${signIn? "active" : ""}`}
    onClick={() => setSignInOpen(!signIn)}>
        Sign in
    </button>
    {signIn && (
        <div className="input-container">
        <h4>Name</h4>
        <input
          className="input-textarea"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ie. John..."
        />
        <h4>Surname</h4>
        <input
          className="input-textarea"
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          placeholder="Ie. Doe..."
        />
        <h4>Email</h4>
        <input
          className="input-textarea"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ie. john.doe@example.com"
        />
      </div>
    )};
    </>
  );
}

export default (SignInForm);