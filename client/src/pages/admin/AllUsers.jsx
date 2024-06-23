import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getUsers = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/user/getAllUsers?searchTerm=${search}`,{
        credentials:"include"
      });
      const data = await res.json();

      if (data && data.success === false) {
        setLoading(false);
        setError(data.message);
        setAllUsers([]);
      } else {
        setLoading(false);
        setAllUsers(data);
        setError("");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    getUsers();
  }, [search]);

  const handleUserDelete = async (userId) => {
    const CONFIRM = window.confirm(
      "Are you sure? The account will be permanently deleted!"
    );
    if (CONFIRM) {
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${API_BASE_URL}/api/user/delete-user/${userId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        setLoading(false);
        alert(data.message);
        getUsers();
      } catch (error) {
        console.log(error);
        setLoading(false);
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="flex justify-center w-full bg-white">
      <div className="w-full max-w-screen-lg shadow-lg rounded-lg p-4">
        <h1 className="text-2xl text-center mb-4">
          {/* {loading ? "Loading..." : "All Users"} */}
          {loading ? "Loading..." : ""}
        </h1>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 rounded-lg border"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {allUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">ID</th>
                  <th className="border border-gray-300 p-2">Username</th>
                  <th className="border border-gray-300 p-2">Email</th>
                  <th className="border border-gray-300 p-2">Address</th>
                  <th className="border border-gray-300 p-2">Phone</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user._id} className="text-center">
                    <td className="border border-gray-300 p-2">{user._id}</td>
                    <td className="border border-gray-300 p-2">{user.username}</td>
                    <td className="border border-gray-300 p-2">{user.email}</td>
                    <td className="border border-gray-300 p-2">{user.address}</td>
                    <td className="border border-gray-300 p-2">{user.phone}</td>
                    <td className="border border-gray-300 p-2">
                      <button
                        disabled={loading}
                        className="p-2 text-red-500 hover:scale-125 hover:bg-red-100 disabled:opacity-50"
                        onClick={() => handleUserDelete(user._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
