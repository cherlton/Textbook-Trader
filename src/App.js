// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import Home from "./components/home/home";  
import ForgotPassword from "./components/auth/ForgotPassword";  
import UpdateProfile from "./components/auth/UpdateProfile";  
import LandingPage  from "./components/home/LandingPage";
import SellerBooks  from "./components/books/SellerBooks";
import UploadBook  from "./components/books/UploadBook";
import Cart  from "./components/cart/CartItems";
import Checkout  from "./components/cart/checkout";
import Testing  from "./components/books/testing";
import OrderConfirmation  from "./components/orders/OrderConfirmation";
import OrderDetails  from "./components/orders/OrderDetails";
import OrdersList  from "./components/orders/OrdersList";
import CourierLogin from './components/courier_auth/CourierLogin';
import CourierDashboard from './components/courier/CourierDashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/LandingPage " replace />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/UpdateProfile" element={<UpdateProfile />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/SellerBooks" element={<SellerBooks />} />
        <Route path="/UploadBook" element={<UploadBook />} />
        <Route path="/Cart" element={<Cart />} />
        {/* <Route path="/Orders" element={<Orders />} /> */}
        <Route path="/Testing" element={<Testing />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
      <Route path="/CourierLogin" element={<CourierLogin />} />
      <Route path="/CourierDashboard" element={<CourierDashboard />} />

<Route path="/orders" element={<OrdersList />} />
<Route path="/orders/:orderId" element={<OrderDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
