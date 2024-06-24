import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
} from "../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import MyBookings from "./user/MyBookings";
import UpdateProfile from "./user/UpdateProfile";
import MyHistory from "./user/MyHistory";
import toast, { Toaster } from 'react-hot-toast';


const Bookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [profilePhoto, setProfilePhoto] = useState(undefined);
  const [photoPercentage, setPhotoPercentage] = useState(0);
  const [activePanelId, setActivePanelId] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
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

 
  return (
    <div className="flex w-full flex-wrap max-sm:flex-col p-4 bg-gray-100">
      {currentUser ? (
        <div className="w-full lg:w-2/3 mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="w-full border-b border-gray-300 mb-4">
            <nav className="w-full border-[#41A4FF] border-b-4 overflow-x-auto navbar mb-4">
              <div className="w-full flex gap-4">
                <button
                  className={
                    activePanelId === 1
                      ? "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-[#41A4FF] text-white"
                      : "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-gray-200 hover:bg-gray-300"
                  }
                  id="bookings"
                  onClick={() => setActivePanelId(1)}
                >
                  Bookings
                </button>
                <button
                  className={
                    activePanelId === 2
                      ? "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-[#41A4FF] text-white"
                      : "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-gray-200 hover:bg-gray-300"
                  }
                  id="updateProfile"
                  onClick={() => setActivePanelId(2)}
                >
                  History
                </button>
              </div>
            </nav>
            <div className="flex justify-center">
              {activePanelId === 1 && <MyBookings />}
              {activePanelId === 2 && <MyHistory />}
            </div>
          </div>
          <Toaster
        position="top-center"
        reverseOrder={false}
      />
        </div>
      ) : (
        <div className="text-red-700 text-xl">Login First</div>
      )}
    </div>
  );
};

export default Bookings;
