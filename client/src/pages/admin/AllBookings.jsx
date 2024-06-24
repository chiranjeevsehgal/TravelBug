import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';



const AllBookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllBookings = async () => {
    setCurrentBookings([]);
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(
        `${API_BASE_URL}/api/booking/get-currentBookings?searchTerm=${searchTerm}`,{
          credentials:"include"
        }
      );
      const data = await res.json();
      if (data?.success) {
        setCurrentBookings(data?.bookings);
        setLoading(false);
        setError(false);
      } else {
        setLoading(false);
        setError(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [searchTerm]);

  const handleCancel = async (id) => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(
        `${API_BASE_URL}/api/booking/cancel-booking/${id}/${currentUser._id}`,
        {
          method: "POST",
          credentials:"include"
          
        }
      );
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        toast.success(data?.message)
        getAllBookings();
      } else {
        setLoading(false);
        toast.error(data?.message)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex justify-center bg-white">
      <div className="w-[95%] shadow-xl rounded-lg p-3 flex flex-col gap-2">
        {loading && <h1 className="text-center text-2xl">Loading...</h1>}
        {error && <h1 className="text-center text-2xl">{error}</h1>}
        <div className="w-full  mb-4">
          <input
            className="border rounded-lg p-2 mb-2 w-full"
            type="text"
            placeholder="Search Username or Email"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        {!loading &&
          currentBookings &&
          currentBookings.map((booking, i) => {
            return (
              <div
                className="w-full border-y-2 p-3 flex flex-wrap overflow-auto gap-3 items-center justify-between"
                key={i}
              >
                <Link to={`/package/${booking?.packageDetails?._id}`}>
                  <img
                    className="w-12 h-12"
                    src={booking?.packageDetails?.packageImages[0]}
                    alt="Package Image"
                  />
                </Link>
                <Link to={`/package/${booking?.packageDetails?._id}`}>
                  <p className="hover:underline">
                    {booking?.packageDetails?.packageName}
                  </p>
                </Link>
                <p>{booking?.buyer?.username}</p>
                <p>{booking?.buyer?.email}</p>
                <p>{booking?.date}</p>
                <button
                  onClick={() => {
                    handleCancel(booking._id);
                  }}
                  className="p-2 rounded bg-red-600 text-white hover:opacity-95"
                >
                  Cancel
                </button>
              </div>
            );
          })}
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
};

export default AllBookings;
