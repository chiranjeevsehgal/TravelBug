import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
} from "../../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import AllBookings from "./AllBookings";
import AdminUpdateProfile from "./AdminUpdateProfile";
import AddPackages from "./AddPackages";
import "./styles/DashboardStyle.css";
import AllPackages from "./AllPackages";
import AllUsers from "./AllUsers";
import Payments from "./Payments";
import RatingsReviews from "./RatingsReviews";
import History from "./History";
import toast, { Toaster } from 'react-hot-toast';


const AdminPanel = () => {
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
      <>
        <div className="w-full lg:w-2/3 mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="main-div">
            <nav className="w-full border-[#41A4FF] border-b-4 overflow-x-auto navbar mb-4">
              <div className="w-full flex gap-4 justify-center">
                <button
                  className={
                    activePanelId === 1
                      ? "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-[#41A4FF] text-white"
                      : "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-gray-200 hover:bg-gray-300"
                  }
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
                  onClick={() => setActivePanelId(2)}
                >
                  Add Packages
                </button>
                <button
                  className={
                    activePanelId === 3
                      ? "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-[#41A4FF] text-white"
                      : "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-gray-200 hover:bg-gray-300"
                  }
                  onClick={() => setActivePanelId(3)}
                >
                  All Packages
                </button>
                <button
                  className={
                    activePanelId === 4
                      ? "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-[#41A4FF] text-white"
                      : "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-gray-200 hover:bg-gray-300"
                  }
                  onClick={() => setActivePanelId(4)}
                >
                  Users
                </button>
                <button
                  className={
                    activePanelId === 5
                      ? "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-[#41A4FF] text-white"
                      : "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-gray-200 hover:bg-gray-300"
                  }
                  onClick={() => setActivePanelId(5)}
                >
                  Payments
                </button>
                <button
                  className={
                    activePanelId === 6
                      ? "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-[#41A4FF] text-white"
                      : "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-gray-200 hover:bg-gray-300"
                  }
                  onClick={() => setActivePanelId(6)}
                >
                  Ratings/Reviews
                </button>
                <button
                  className={
                    activePanelId === 7
                      ? "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-[#41A4FF] text-white"
                      : "p-3 rounded-t-lg transition-all duration-300 text-nowrap bg-gray-200 hover:bg-gray-300"
                  }
                  onClick={() => setActivePanelId(7)}
                >
                  History
                </button>
              </div>
            </nav>
            <div className="content-div flex flex-wrap p-4 bg-gray-50 rounded-lg">
              {activePanelId === 1 ? (
                <AllBookings />
              ) : activePanelId === 2 ? (
                <AddPackages />
              ) : activePanelId === 3 ? (
                <AllPackages />
              ) : activePanelId === 4 ? (
                <AllUsers />
              ) : activePanelId === 5 ? (
                <Payments />
              ) : activePanelId === 6 ? (
                <RatingsReviews />
              ) : activePanelId === 7 ? (
                <History />
              ) : activePanelId === 8 ? (
                <AdminUpdateProfile />
              ) : (
                <div>Page Not Found!</div>
              )}
            </div>
          </div>
        </div>
      </>
    ) : (
      <div className="w-full text-center">
        <p className="text-red-700 font-semibold text-lg">Please login first</p>
      </div>
    )}
    
<Toaster
        position="top-center"
        reverseOrder={false}
      />
  </div>
);

};

export default AdminPanel;
