import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Login from "./Login";
import Header from "./Header";
import Footer from "./Footer";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";
import AddProduct from "./AddProduct";
import Inventory from "./Inventory";
import Scanner from "./Scanner";
import ScannerDetail from "./ScannerDetail";
import ProductDetail from "./ProductDetail";
import Notification from "./Notification";
import Analytics from "./Analytics";
import ProductWastage from './ProductWastage'
import Cookies from "js-cookie";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { styled } from "@mui/material";
import theme from "./mui_customization/theme";

const RootContainer = styled("div")({
  display: "flex",
  height: "85vh",
});
const ContentContainer = styled("main")({
  flexGrow: 1,
  overflow: "auto",
});

const App = () => {
  let token = Cookies.get("token");

  const [loggedIn, setLoggedIn] = useState(token ? true : false);

  if (loggedIn) {
    let token = Cookies.get("token");
    console.log(token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  const handleLogin = () => {
    setLoggedIn(() => {
      return true;
    });
  };

  const handleLogout = () => {
    setLoggedIn(() => {
      Cookies.set("token", "");
      Cookies.set("firstName", "");
      Cookies.set("photo", "");
      axios.defaults.headers.common["Authorization"] = null;
      return false;
    });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          {loggedIn && <Header />}
          <RootContainer>
            {loggedIn && <NavBar />}
            <ContentContainer>
              <Routes>
                <Route
                  exact
                  path="/"
                  element={!loggedIn ? <Navigate to="/login" /> : <Scanner />}
                />
                <Route
                  path="/dashboard"
                  element={loggedIn ? <Dashboard /> : <Navigate to="/" />}
                />
                <Route
                  path="/login"
                  element={
                    loggedIn ? (
                      <Navigate to="/" />
                    ) : (
                      <Login onLogin={handleLogin} />
                    )
                  }
                />
                <Route
                  path="/scannerdetail"
                  element={loggedIn ? <ScannerDetail /> : <Navigate to="/" />}
                />
                <Route
                  path="/add-product"
                  element={loggedIn ? <AddProduct /> : <Navigate to="/" />}
                />
                <Route
                  path="/productdetail"
                  element={loggedIn ? <ProductDetail /> : <Navigate to="/" />}
                />
                <Route
                  path="/inventory"
                  element={loggedIn ? <Inventory /> : <Navigate to="/" />}
                />
                <Route
                  path="/notification"
                  element={loggedIn ? <Notification /> : <Navigate to="/" />}
                />
                <Route
                  path="/analytics"
                  element={loggedIn ? <Analytics /> : <Navigate to="/" />}
                />
                <Route
                  path="/productwastage"
                  element={loggedIn ? <ProductWastage /> : <Navigate to="/" />}
                />
              </Routes>
              
            </ContentContainer>
          </RootContainer>
        </BrowserRouter>
        <Footer loggedIn={loggedIn} onLogout={handleLogout} />
      </ThemeProvider>
    </>
  );
};

export default App;
