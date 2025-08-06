import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // or your main component file
import "./index.css"; // import Tailwind styles here

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
