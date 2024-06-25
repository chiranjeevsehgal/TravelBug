import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  updatePassStart,
  updatePassSuccess,
  updatePassFailure,
} from "../../redux/user/userSlice";
import { CiCircleInfo } from "react-icons/ci";
import toast, { Toaster } from 'react-hot-toast';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);

  const [updateProfileDetailsPanel, setUpdateProfileDetailsPanel] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });
  const [updatePassword, setUpdatePassword] = useState({
    oldpassword: "",
    newpassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: false,
    email: false,
    phone: false,
  });

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    // Validate required fields
    if (value.trim() === "" && (id === "username" || id === "email" || id === "phone")) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [id]: true,
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [id]: false,
      }));
    }

    // Validate phone number length
    if (id === "phone" && value.trim().length !== 10) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        phone: true,
      }));
    } else if (id === "phone" && value.trim().length === 10) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        phone: false,
      }));
    }
  };

    const handlePass = (e) => {
    setUpdatePassword({
      ...updatePassword,
      [e.target.id]: e.target.value,
    });
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();

    // Check for form errors before proceeding
    if (Object.values(formErrors).some((error) => error)) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    // Check if any field has changed
    if (
      currentUser.username === formData.username &&
      currentUser.email === formData.email &&
      currentUser.address === formData.address &&
      currentUser.phone === formData.phone
    ) {
      toast.error("Change at least 1 field to update details.");
      return;
    }

    try {
      dispatch(updateUserStart());
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false && res.status !== 201 && res.status !== 200) {
        dispatch(updateUserFailure(data?.messsage));
        toast.error("Session Ended! Please login again.");
        navigate("/login");
        return;
      }

      if (data.success && res.status === 201) {
        toast.success(data?.message);
        navigate("/profile/user");
        dispatch(updateUserSuccess(data?.user));
        return;
      }

      toast(data?.message, {
        icon: <CiCircleInfo />,
      });
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserPassword = async (e) => {
    e.preventDefault();

    // Check for password validation
    if (updatePassword.oldpassword === "" || updatePassword.newpassword === "") {
      toast.error("Enter a valid password.");
      return;
    }
    if (updatePassword.oldpassword === updatePassword.newpassword) {
      toast.error("New password can't be same as old.");
      return;
    }

    try {
      dispatch(updatePassStart());
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/user/update-password/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatePassword),
      });
      const data = await res.json();

      if (data.success === false && res.status !== 201 && res.status !== 200) {
        dispatch(updatePassFailure(data?.message));
        toast.error("Session Ended! Please login again.");
        navigate("/login");
        return;
      }

      dispatch(updatePassSuccess());
      toast(data?.message, {
        icon: <CiCircleInfo />,
      });

      setUpdatePassword({
        oldpassword: "",
        newpassword: "",
      });

      navigate("/profile/user");
      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full p-4 bg-gray-100">
      <div className="w-full max-w-md">
        {updateProfileDetailsPanel ? (
          <div className="flex flex-col bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col mb-4 w-full">
              <label htmlFor="username" className="font-semibold mb-1">Username:</label>
              <input
                type="text"
                id="username"
                className={`p-2 rounded-md border ${formErrors.username ? "border-red-500" : "border-gray-300"}`}
                value={formData.username}
                onChange={handleChange}
              />
              {formErrors.username && (
                <span className="text-red-500 text-sm">Username is required.</span>
              )}
            </div>
            <div className="flex flex-col mb-4 w-full">
              <label htmlFor="email" className="font-semibold mb-1">Email:</label>
              <input
                type="email"
                id="email"
                className={`p-2 rounded-md border ${formErrors.email ? "border-red-500" : "border-gray-300"}`}
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <span className="text-red-500 text-sm">Email is required.</span>
              )}
            </div>
            <div className="flex flex-col mb-4 w-full">
              <label htmlFor="address" className="font-semibold mb-1">Address:</label>
              <textarea
                maxLength={200}
                id="address"
                className="p-2 rounded-md border border-gray-300 resize-none"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col mb-4 w-full">
              <label htmlFor="phone" className="font-semibold mb-1">Phone:</label>
              <input
                type="text"
                id="phone"
                className={`p-2 rounded-md border ${formErrors.phone ? "border-red-500" : "border-gray-300"}`}
                value={formData.phone}
                onChange={handleChange}
              />
              {formErrors.phone && (
                <span className="text-red-500 text-sm">Phone number must be 10 digits long.</span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                disabled={loading}
                onClick={updateUserDetails}
                className="w-full sm:w-1/2 px-4 py-2 border border-[#41A4FF] text-[#41A4FF] rounded-md hover:bg-[#41A4FF] hover:text-white transition-colors duration-200 text-center"
              >
                {loading ? "Loading..." : "Update"}
              </button>
              <button
                disabled={loading}
                type="button"
                onClick={() => setUpdateProfileDetailsPanel(false)}
                className="w-full sm:w-1/2 px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200"
              >
                {loading ? "Loading..." : "Change Password"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6">
            <h1 className="text-xl text-start font-semibold mb-4">Change Password</h1>
            <div className="flex flex-col mb-4 w-full">
              <label htmlFor="oldpassword" className="font-semibold mb-1">Enter old password:</label>
              <input
                type="password"
                id="oldpassword"
                className="p-2 rounded border border-gray-300"
                value={updatePassword.oldpassword}
                onChange={handlePass}
              />
            </div>
            <div className="flex flex-col mb-4 w-full">
              <label htmlFor="newpassword" className="font-semibold mb-1">Enter new password:</label>
              <input
                type="password"
                id="newpassword"
                className="p-2 rounded border border-gray-300"
                value={updatePassword.newpassword}
                onChange={handlePass}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full">
              <button
                disabled={loading}
                onClick={updateUserPassword}
                className="w-full sm:w-1/2 p-2 border border-[#41A4FF] text-[#41A4FF] rounded hover:bg-[#41A4FF] hover:text-white "
              >
                {loading ? "Loading..." : "Update Password"}
              </button>
              <button
                disabled={loading}
                onClick={() => {
                  setUpdateProfileDetailsPanel(true);
                  setUpdatePassword({
                    oldpassword: "",
                    newpassword: "",
                  });
                }}
                type="button"
                className="w-full sm:w-1/2 p-2 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                {loading ? "Loading..." : "Back"}
              </button>
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default UpdateProfile;
