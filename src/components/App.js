import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import Login from "./Login";
import Footer from "./Footer";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";
import AddProduct from "./AddProduct";
import Inventory from "./Inventory"
import Scanner from "./Scanner";
import ScannerDetail from "./ScannerDetail";
import ProductDetail from "./ProductDetail";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./mui_customization/theme";

const App = (props) => {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith("token="));

  const [loggedIn, setLoggedIn] = useState(tokenCookie ? true : false);

  const handleLogin = () => {
    setLoggedIn(() => {
        let token = ""
        const cookies = document.cookie.split(";");
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith("token="));
        if (tokenCookie) {
            token = tokenCookie.substring(tokenCookie.indexOf("=") + 1);
        }
        console.log(token);
        //append token to axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        if (token) {
          return true;
        }
    });
  };

  const handleLogout = () => {
    setLoggedIn(() => {
        document.cookie ="token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        axios.defaults.headers.common['Authorization'] = null;
        return false;
    });
  };

  return (
    <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
          {loggedIn && <NavBar />}
          <Routes>
              <Route
                exact
                path="/"
                element={
                  !loggedIn ? <Navigate to="/login" /> : <Dashboard />
                }
              />
              <Route
                path="/scanner"
                element={
                  loggedIn ? <Scanner /> : <Navigate to="/" />
                }
              />
              <Route
                path="/login"
                element={
                  loggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
                }
              />
              <Route
                path="/scannerdetail"
                element={
                  loggedIn ? <ScannerDetail /> : <Navigate to="/" />
                }
              />
              <Route 
                path="/add-product"  
                element={
                  loggedIn ? <AddProduct />: <Navigate to="/" />
                } 
              />
                <Route
                path="/productdetail"
                element={
                  loggedIn ? <ProductDetail />: <Navigate to="/" />
                } 
              />
              <Route
                path="/inventory"
                element={
                  loggedIn ? <Inventory />: <Navigate to="/" />
                } 
              />
          </Routes>
      </BrowserRouter>
      <Footer loggedIn={loggedIn} onLogout={handleLogout} />
      </ThemeProvider>
    </>
  );
};

export default App;
