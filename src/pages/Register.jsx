import React, { useState } from "react";
import "./Register.scss";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Register() {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        // const user = userCredential.user;
        navigate("/account/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(true);
        console.log(error);
      });
  };

  return (
    <div>
      <div class="login-page">
        <div class="form">
          <form class="login-form">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="username"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="password"
            />
            {error && <span>hello please check your login details </span>}
            <button onClick={handleSignup}>login</button>
            <p class="message">
              Not registered? <a href="/account/login">Create an account</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
