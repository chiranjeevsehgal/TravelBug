import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHome, FaSuitcase, FaUser } from "react-icons/fa";
import defaultProfileImg from "../../assets/images/profile.png";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();

  const handleSearch = () => {
    if (search !== "") {
      navigate(`/packages?searchTerm=${search}`);
      setSearch("");
    } else {
      alert("Enter to search");
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="bg-white text-gray-900 py-4 px-6 flex justify-between items-center shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/" className="flex items-center gap-0">
            <span className="text-[#41A4FF]">Travel</span>
            <span>Bug</span>
            <span className="text-[#41A4FF] ml-2">AI</span>
          </Link>
        </h1>
      </div>

      {/* Hamburger menu for mobile */}
      <button
        onClick={toggleNav}
        className="block md:hidden text-gray-800 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isNavOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          )}
        </svg>
      </button>

      {/* Navigation links */}
      <nav className={`md:flex md:items-center md:space-x-6 ${isNavOpen ? "block" : "hidden"}`}>
        <ul className="flex flex-col md:flex-row md:items-center gap-6">
          <li>
            <Link to="/" className={`hover:text-[#41A4FF] flex items-center gap-1 ${location.pathname === "/" ? "text-[#41A4FF]" : ""}`}>
              <FaHome />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/packages" className={`hover:text-[#41A4FF] flex items-center gap-1 ${location.pathname.includes("/packages") ? "text-[#41A4FF]" : ""}`}>
              <FaSuitcase />
              <span>Packages</span>
            </Link>
          </li>
          {currentUser && (
            <li>
              <Link
                to={`/profile/${currentUser.user_role === 1 ? "dashboard" : "bookings"}`}
                className={`hover:text-[#41A4FF] flex items-center gap-1 ${location.pathname.includes(currentUser.user_role === 1 ? "/dashboard" : "/bookings") ? "text-[#41A4FF]" : ""
                  }`}
              >
                <FaSuitcase />
                <span>{currentUser.user_role === 1 ? "Admin Panel" : "Bookings"}</span>
              </Link>
            </li>
          )}
          <li>
            {currentUser ? (
              <Link
                to={`/profile/${currentUser.user_role === 1 ? "admin" : "user"}`}
                className={`flex items-center gap-2 hover:text-[#41A4FF] ${location.pathname.includes(currentUser.user_role === 1 ? "/admin" : "/user") ? "text-[#41A4FF]" : ""
                  }`}
              >
                <img
                  src={currentUser.avatar || defaultProfileImg}
                  alt={currentUser.username}
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
                <span>{currentUser.username}</span>
              </Link>
            ) : (
              <Link to="/login" className="hover:text-[#41A4FF] flex items-center gap-1">
                <FaUser />
                <span>Login</span>
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
