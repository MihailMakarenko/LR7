import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
// import { Provider } from "react-redux";
// import store from "./store/Store";
import { StrictMode } from "react";

const root = ReactDOM.createRoot(document.getElementById("root"));
console.log("rst");
root.render(
  <StrictMode>
    {/* <Provider store={store}>
    </Provider> */}
    <App />
  </StrictMode>
);

// reportWebVitals();
