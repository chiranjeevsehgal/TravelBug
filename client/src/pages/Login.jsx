import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // console.log(formData);

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
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.success) {
        dispatch(loginSuccess(data?.user));
        
        alert(data?.message);
        navigate("/");  
      } else {
        dispatch(loginFailure(data?.message));
        alert(data?.message);
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen ">
      <form onSubmit={handleSubmit} className="w-2/6 max-w-sm px-8 py-6 bg-gray-100 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>
        <div className="space-y-4 mt-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-semibold">Email:</label>
            <input
              type="email"
              id="email"
              className="p-3 text-gray-700 border rounded focus:border-blue-500 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 font-semibold">Password:</label>
            <input
              type="password"
              id="password"
              className="p-3 text-gray-700 border rounded focus:border-blue-500 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>
          <p className="text-sm text-center text-blue-600 hover:underline">
            <Link to={`/signup`}>Don't have an account? Signup</Link>
          </p>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 text-white bg-blue-600 rounded hover:bg-blue-700 ${loading ? "bg-blue-300" : ""}`}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default Login;
