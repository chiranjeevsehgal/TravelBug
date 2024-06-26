import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      dispatch(loginStart());
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Login response:", data);
      if (data?.success) {
        dispatch(loginSuccess(data?.user));
        
        toast.success("Login Successful")
        

        navigate("/");
        
      } else {
        dispatch(loginFailure(data?.message));
        toast.error(data?.message);  

      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      console.log(error);
    }
  };

  return (
    <div className="flex flex-wrap min-h-screen w-full content-center justify-center bg-gray-100 py-10">
      <div className="flex shadow-md">
        <div className="flex flex-wrap content-center justify-center rounded-md bg-white w-full md:w-[24rem] p-5 md:p-0" style={{ height: "auto", minHeight: "32rem" }}>
          <div className="w-full md:w-72">
            <h1 className="text-xl font-semibold">Welcome back</h1>
            <small className="text-gray-400">Welcome back! Please enter your details</small>

            <form className="mt-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="mb-2 block text-xs font-semibold">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="mb-2 block text-xs font-semibold">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="*****"
                  className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3 flex flex-wrap content-center justify-end">
                <a href="#" className="text-xs font-semibold text-[#41A4FF]">Forgot password?</a>
              </div>

              <div className="mb-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-center text-white bg-[#41A4FF] hover:bg-[#41A4FF] py-2 rounded-md mb-4 disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
                <button className="flex items-center justify-center w-full border border-gray-300 hover:border-gray-500 py-2 rounded-md">
                  <img className="w-5 mr-2" src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="Google logo" />
                  Sign in with Google
                </button>
              </div>
            </form>

            <div className="text-center mt-6">
              <span className="text-sm text-gray-500">Don't have account?</span>
              <Link to="/signup" className="text-sm font-semibold text-[#41A4FF] ml-1">Sign up</Link>
            </div>

            {error && <p className="text-sm text-center text-red-600 mt-3">{error}</p>}
          </div>
        </div>

        <div className="hidden md:flex md:flex-wrap content-center justify-center rounded-r-md" style={{ width: "24rem", height: "32rem" }}>
          <img className="w-full h-full bg-center bg-no-repeat bg-cover rounded-r-md" src="images/login.jpg" alt="Login banner" />
        </div>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />

    </div>
  );
};

export default Login;