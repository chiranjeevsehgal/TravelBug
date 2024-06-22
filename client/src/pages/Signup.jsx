import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
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
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, formData);
      if (res?.data?.success) {
        alert(res?.data?.message);
        navigate("/login");
      } else {
        alert(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen"
      // style={{
      //   width: "100%",
      //   height: "90vh",
      //   background:
      //     "linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
      // }}
    >
      <form onSubmit={handleSubmit} className="w-2/6 max-w-sm px-8 py-6 bg-gray-100 rounded-lg shadow-xl">
        {/* <div className=> */}
        <h1 className="text-3xl font-bold text-center text-gray-800">Signup</h1>
        <div className="space-y-4 mt-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-2 font-semibold">
              Username:
            </label>
            <input
              type="text"
              id="username"
              className="p-3 text-gray-700 border rounded focus:border-blue-500 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-semibold">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="p-3 text-gray-700 border rounded focus:border-blue-500 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 font-semibold">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="p-3 text-gray-700 border rounded focus:border-blue-500 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="address" className="mb-2 font-semibold">
              Address:
            </label>
            <textarea
              maxLength={200}
              type="text"
              id="address"
              className="p-3 text-gray-700 border rounded focus:border-blue-500 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-2 font-semibold">
              Phone:
            </label>
            <input
              type="text"
              id="phone"
              className="p-3 text-gray-700 border rounded focus:border-blue-500 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>
          <p className="text-blue-700 text-sm hover:underline">
            <Link to={`/login`}>Have an account? Login</Link>
          </p>
          <button className="w-full p-3 text-white bg-blue-600 rounded hover:bg-blue-700">
            Signup
          </button>

        </div>
      </form>
    </div>
  );
};

export default Signup;
