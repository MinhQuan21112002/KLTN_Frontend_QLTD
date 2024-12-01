import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { ContextProvider } from "./contexts/ContextProvider";
import { registerLicense } from '@syncfusion/ej2-base';
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById("root"));

registerLicense('Ngo9BigBOggjHTQxAR8/V1NHaF1cWmhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFiWH1WcXdUQ2VUVERwVw==');
//Ngo9BigBOggjHTQxAR8/V1NHaF1cW2hIfEx0TXxbf1xzZFRGal9QTnRdUj0eQnxTdEZiWH1WcnZRQWRZV0FwVw==
root.render(
  
    <ChakraProvider>
      <ContextProvider> 
      <GoogleOAuthProvider clientId="1015345154887-ceponkjuv16aic2kl42pgrfsr0qqpgg5.apps.googleusercontent.com"><App /></GoogleOAuthProvider>;
      </ContextProvider>
     
    </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
