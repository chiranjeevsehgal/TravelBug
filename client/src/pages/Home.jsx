import React, { useEffect, useState } from "react";
import "./styles/Home.css";
import { FaCalendar, FaSearch, FaStar } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import PackageCard from "./PackageCard";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const [topPackages, setTopPackages] = useState([]);
  const [latestPackages, setLatestPackages] = useState([]);
  const [offerPackages, setOfferPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const getTopPackages = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(
        `${API_BASE_URL}/api/package/get-packages?sort=packageRating&limit=8`,{
          credentials:"include"
        }
      );
      const data = await res.json();
      if (data?.success) {
        setTopPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLatestPackages = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(
        `${API_BASE_URL}/api/package/get-packages?sort=createdAt&limit=8`,{
          credentials:"include"
        }
      );
      const data = await res.json();
      if (data?.success) {
        setLatestPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOfferPackages = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(
        `${API_BASE_URL}/api/package/get-packages?sort=createdAt&offer=true&limit=6`,{
          credentials:"include"
        }
      );
      const data = await res.json();
      if (data?.success) {
        setOfferPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTopPackages();
    getLatestPackages();
    getOfferPackages();
  }, []);

  return (
    <div className="p-5 font-sans">

      {/* Header section */}
      {/* <div className="text-center mb-10">
        <h1 className="text-4xl mb-2.5 text-gray-800">The Travel Index</h1>
        <p className="text-xl text-gray-600">
          Make Your Travel Dream Come True With Our Amazing Packages
        </p>
        <div className="flex justify-center mt-5">
          <input
            type="text"
            className="w-72 p-2.5 border border-gray-300 rounded-l-md"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="p-2.5 bg-red-500 text-white rounded-r-md cursor-pointer"
            onClick={() => navigate(`/search?searchTerm=${search}`)}
          >
            <FaSearch />
          </button>
        </div>
        <div className="flex justify-center gap-4 mt-5">
          <button
            className="p-2.5 bg-gray-200 text-gray-800 rounded-md cursor-pointer flex items-center gap-1.5 hover:bg-red-500 hover:text-white"
            onClick={() => navigate("/search?offer=true")}
          >
            Best Offers <LuBadgePercent />
          </button>
          <button
            className="p-2.5 bg-gray-200 text-gray-800 rounded-md cursor-pointer flex items-center gap-1.5 hover:bg-red-500 hover:text-white"
            onClick={() => navigate("/search?sort=packageRating")}
          >
            Top Rated <FaStar />
          </button>
          <button
            className="p-2.5 bg-gray-200 text-gray-800 rounded-md cursor-pointer flex items-center gap-1.5 hover:bg-red-500 hover:text-white"
            onClick={() => navigate("/search?sort=createdAt")}
          >
            Latest <FaCalendar />
          </button>
          <button
            className="p-2.5 bg-gray-200 text-gray-800 rounded-md cursor-pointer flex items-center gap-1.5 hover:bg-red-500 hover:text-white"
            onClick={() => navigate("/search?sort=packageTotalRatings")}
          >
            Most Rated <FaRankingStar />
          </button>
        </div>
      </div> */}
      <div className="mt-4">
        {loading && <p>Loading...</p>}
        {!loading && topPackages.length === 0 && latestPackages.length === 0 && offerPackages.length === 0 && (
          <p>No Packages Yet!</p>
        )}
        {!loading && topPackages.length > 0 && (
          <div className="flex flex-wrap gap-5 justify-center">
            {topPackages.map((packageData, index) => (
              <PackageCard key={index} packageData={packageData} />
            ))}
          </div>
        )}
        {/* {!loading && latestPackages.length > 0 && (
          <>
            <h2 className="section-title">Latest Packages</h2>
            <div className="package-cards">
              {latestPackages.map((packageData, index) => (
                <PackageCard key={index} packageData={packageData} />
              ))}
            </div>
          </>
        )}
        {!loading && offerPackages.length > 0 && (
          <>
            <h2 className="section-title">Best Offers</h2>
            <div className="package-cards">
              {offerPackages.map((packageData, index) => (
                <PackageCard key={index} packageData={packageData} />
              ))}
            </div>
          </>
        )} */}
      </div>
    </div>
  );
};

export default Home;
