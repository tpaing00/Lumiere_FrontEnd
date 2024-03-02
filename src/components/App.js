import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./Login";
import Footer from "./Footer";
import NavBar from "./NavBar";
import AddProduct from "./AddProduct";
// import Inventory from "./Inventory"
import Scanner from "./Scanner";
import ScannerDetail from "./ScannerDetail";

const App = (props) => {
  let token = document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith("token="));
  const [loggedIn, setLoggedIn] = useState(token ? true : false);

  const handleLogin = () => {
    setLoggedIn(() => {
      token = document.cookie
        .split(";")
        .some((cookie) => cookie.trim().startsWith("token="));
      if (token) {
        return true;
      }
    });
  };

  const handleLogout = () => {
    setLoggedIn(() => {
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return false;
    });
  };

  return (
    <>
      <BrowserRouter>
          {loggedIn && <NavBar />}
          <Routes>
              <Route
                exact
                path="/"
                element={
                  !loggedIn ? <Navigate to="/login" /> : <h2>Welcome to Lumière</h2>
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
                path="/page"
                element={
                  loggedIn ? <Page /> : <Navigate to="/" />
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
              {/* <Route
                path="/inventory"
                element={
                  loggedIn ? <Inventory />: <Navigate to="/" />
                } 
              /> */}
          </Routes>
      </BrowserRouter>
      <Footer loggedIn={loggedIn} onLogout={handleLogout} />
    </>
  );
};

export default App;
