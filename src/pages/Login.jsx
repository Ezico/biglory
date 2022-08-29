import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Login() {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // console.log(user);
        dispatch({ type: "LOGIN", payload: user });
        navigate("/");
      })
      .catch((error) => {
        setError(true);
      });
  };

  return (
    <div>
      <section id="contact">
        <div class="contact-box">
          <div class="contact-form-wrapper">
            <form onSubmit={handleLogin}>
              <div class="form-item">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  required
                />
                <label>Email:</label>
              </div>
              <div class="form-item">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  required
                />
                <label>Password:</label>
              </div>
              {error && <span>Wrong email or password!</span>}
              <button class="submit-btn">Login</button>
            </form>

            <br />
            <p>
              Dont have an account? <Link to="/account/register">Sign Up</Link>{" "}
              Here
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
