import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Page from './Page';
import Footer from './Footer';
import { useState } from 'react';
import Scanner from './Scanner';

const App = props => {

    let token = document.cookie.split(';').some(cookie => cookie.trim().startsWith('token='));
    const [loggedIn, setLoggedIn] = useState(token? true: false);

    const handleLogin = () => {
        setLoggedIn(()=>{
            token = document.cookie.split(';').some(cookie => cookie.trim().startsWith('token='));
            if(token) {
                return true;
            }
        });
    };
      
    const handleLogout = () => {
        setLoggedIn(()=>{
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                return false;
        });
    };
    
    return (
        <> 
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element= {!loggedIn ? <Navigate to="/login" /> : <Page />} />  
                <Route path="/login"  element={loggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin}/>} />  
            </Routes>
        </BrowserRouter>
        {/* <Scanner /> */}
        <Footer loggedIn={loggedIn} onLogout={handleLogout} />
        </>
    );
}

export default App;