import './style.css'
import React from "react";
import ReactDOM from "react-dom";
import App from './App'

// const root = ReactDOM.createRoot(document.getElementById('react-container'));

// root.render(
//     <React.StrictMode>
//         <App title="Hello React App with props!" subtitle="My first React app is here!!!" />
//     </React.StrictMode>
// );

ReactDOM.render(
    <App title="Welcome to Lumiere!" subtitle="My first React app is here at Netlify!!!" />,
    document.getElementById('react-container')
);