import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./styles/globals.css";
import "./styles/Auth.css";
import "./styles/Layout.css";
import "./styles/Home.css";
import "./styles/Search.css";
import "./styles/Pages.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

