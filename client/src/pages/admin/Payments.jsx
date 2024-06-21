import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const Payments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/get-allBookings?searchTerm=${search}`
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

  const handleUserDelete = async (bookingId) => {
    const CONFIRM = window.confirm(
      "Are you sure? The booking will be permanently deleted!"
    );
    if (CONFIRM) {
      try {
        setLoading(true);
        const res = await fetch(`/api/booking/delete-booking/${bookingId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data?.success) {
          alert(data?.message);
          getAllBookings();
        } else {
          alert("Something went wrong!");
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        alert("Something went wrong!");
      }
    }
  };

  return (
    <div className="w-full flex justify-center bg-white">
      <div className="w-full max-w-screen-lg shadow-xl rounded-lg p-4">
        {/* <h1 className="text-2xl text-center mb-4">Payments</h1> */}
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
                  <th className="border p-2">Total Price</th>
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
                    <td className="border p-2">{booking?.buyer?.username}</td>
                    <td className="border p-2">{booking?.buyer?.email}</td>
                    <td className="border p-2">{booking?.date}</td>
                    <td className="border p-2">Rs. {booking?.totalPrice}</td>
                    <td className="border p-2">
                      <button
                        className="p-2 text-red-500 hover:text-red-700"
                        onClick={() => handleUserDelete(booking?._id)}
                        disabled={loading}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && allBookings.length === 0 && (
          <p className="text-center">No payments found.</p>
        )}
      </div>
    </div>
  );
};

export default Payments;
