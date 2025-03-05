import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./components/Navbar";
// import NumberButtons from "./components/NumberButtons";
import { Toaster } from "react-hot-toast";

// import AdminDashboard from "./pages/AdminDashboard";
import useAuthStore from "./store/useAuthStore";


const App = () => {
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {

  }, [])

  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
      {/* Background gradient  */}
      <div className='absolute z-30 inset-0 overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
        </div>
      </div>
      {/* Navbar and Routes */}

      <div className="relative z-50 py-20  " >
        <Toaster />
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={user ? <HomePage /> : <SignupPage />} />
          <Route path="/login" element={user ? <HomePage /> : <LoginPage />} />
          <Route path="/Admindashboard" element={user?.data?.role === "admin" ? <AdminDashboard />  : <Navigate to="/login" />} />
          {/* <Route path="/num" element={<NumberButtons />} /> */}
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </div>
    </div >
  );
};

export default App;
