import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Page from './Page';
import Footer from './Footer';
import { useState } from 'react';

const App = props => {

    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogin = () => {
        setLoggedIn(true);
    };
      
    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setLoggedIn(false);
    };

    return (
        <> 
        <BrowserRouter>
            <Routes>
                <Route exact path="/login"  element={loggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                <Route path="/" element= {!loggedIn ? <Navigate to="/login" /> : <Page />} />  
            </Routes>
        </BrowserRouter>
        <Footer loggedIn={loggedIn} onLogout={handleLogout} />
    </>
    );
}

export default App;