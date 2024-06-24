import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

const History = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

      const res = await fetch(
        `${API_BASE_URL}/api/booking/get-allBookings?searchTerm=${search}`,{
          credentials:"include"
        }
      );
      const data = await res.json();
      if (data?.success) {
        setAllBookings(data?.bookings);
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
  }, [search]);

  const handleHistoryDelete = async (id) => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(
        `${API_BASE_URL}/api/booking/delete-booking-history/${id}/${currentUser._id}`,
        {
          method: "DELETE",
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
      <div className="w-full max-w-screen-lg shadow-xl rounded-lg p-4">
        {/* <h1 className="text-2xl text-center mb-4">History</h1> */}
        {loading && <h1 className="text-center text-2xl">Loading...</h1>}
        {error && <h1 className="text-center text-2xl text-red-600">{error}</h1>}
        <div className="w-full mb-4">
          <input
            className="w-full p-2 rounded-lg border"
            type="text"
            placeholder="Search Username or Email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        {!loading && allBookings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Package Image</th>
                  <th className="border p-2">Package Name</th>
                  <th className="border p-2">Username</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map((booking, i) => (
                  <tr key={i} className="bg-white text-center">
                    <td className="border p-2 flex justify-center items-center">
                      <Link to={`/package/${booking?.packageDetails?._id}`}>
                        <img
                          className="w-16 h-16 rounded-full object-cover"
                          src={booking?.packageDetails?.packageImages[0]}
                          alt="Package Image"
                        />
                      </Link>
                    </td>
                    <td className="border p-2">
                      <Link to={`/package/${booking?.packageDetails?._id}`}>
                        {booking?.packageDetails?.packageName}
                      </Link>
                    </td>
                    <td className="border p-2">
                      {booking?.buyer?.username}
                    </td>
                    <td className="border p-2">
                      {booking?.buyer?.email}
                    </td>
                    <td className="border p-2">
                      {booking?.date}
                    </td>
                    <td className="border p-2">
                      {(new Date(booking?.date).getTime() < new Date().getTime() ||
                        booking?.status === "Cancelled") && (
                        <button
                          onClick={() => handleHistoryDelete(booking._id)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && allBookings.length === 0 && (
          <p className="text-center">No history found.</p>
        )}
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
};

export default History;
