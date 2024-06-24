import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, formData);
      if (res?.data?.success) {
        
        toast.success(res?.data?.message); 
        navigate("/login");
        // setTimeout(()=>{
        // },2000)
      } else {
        toast.error(res?.data?.message);
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-100 py-10 px-5">
      <div className="flex flex-col lg:flex-row shadow-lg rounded-lg overflow-hidden bg-white w-full max-w-4xl">
        {/* Signup form */}
        <div className="flex flex-col justify-center p-8 w-full lg:w-1/2">
          <div className="w-full">
            <h1 className="text-2xl font-semibold mb-2">Create an account</h1>
            <p className="text-gray-500 mb-6">Please enter your details to sign up</p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="username">Username</label>
                <input type="text" id="username" placeholder="Enter your username" className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700" onChange={handleChange} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700" onChange={handleChange} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="*****" className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700" onChange={handleChange} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="address">Address</label>
                <textarea id="address" placeholder="Enter your address" className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700" onChange={handleChange} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="phone">Phone</label>
                <input type="text" id="phone" placeholder="Enter your phone number" className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700" onChange={handleChange} />
              </div>

              <button type="submit" className="w-full text-center text-white bg-[#41A4FF] hover:bg-[#41A4FF] py-2 rounded-md mb-4">Sign up</button>
              <button className="flex items-center justify-center w-full border border-gray-300 hover:border-gray-500 py-2 rounded-md">
                <img className="w-5 h-5 mr-2" src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="Google logo" />
                Sign up with Google
              </button>
            </form>

            <div className="text-center mt-6">
              <span className="text-sm text-gray-500">Already have an account?</span>
              <Link to="/login" className="text-sm font-semibold text-[#41A4FF] ml-1">Sign in</Link>
            </div>
          </div>
        </div>

        {/* Signup banner - only visible on larger screens */}
        <div className="hidden lg:flex items-center justify-center w-full lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/images/login.jpg')" }}>
          {/* Overlay for better text contrast */}
          <div className="w-full h-fullopacity-50"></div>
        </div>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
};

export default Signup;
