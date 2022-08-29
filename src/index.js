import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { FaWhatsapp } from "react-icons/fa";

import App from "./App";
import ScrollToTop from "./components/ScrollToTop";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./AuthContext";

ReactDOM.render(
  <BrowserRouter>
    <ScrollToTop>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>

      <a
        href="https://wa.link/lqggo0"
        class="float"
        target="_blank"
        rel="noopener noreferrer"
        style={{ backgroundColor: "#0b913e" }}
      >
        <FaWhatsapp className="my-float" />
        <span className="my-float2">Chat With Us</span>
      </a>
    </ScrollToTop>
  </BrowserRouter>,
  document.getElementById("root")
);
