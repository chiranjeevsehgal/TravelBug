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

  const handleProfilePhoto = (photo) => {
    try {
      dispatch(updateUserStart());
      const storage = getStorage(app);
      const photoname = new Date().getTime() + photo.name.replace(/\s/g, "");
      const storageRef = ref(storage, `profile-photos/${photoname}`); //profile-photos - folder name in firebase
      const uploadTask = uploadBytesResumable(storageRef, photo);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          //   console.log(progress);
          setPhotoPercentage(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
            const res = await fetch(
              `${API_BASE_URL}/api/user/update-profile-photo/${currentUser._id}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": " application/json",
                },
                body: JSON.stringify({ avatar: downloadUrl }),
              }
            );
            const data = await res.json();
            if (data?.success) {
              alert(data?.message);
              setFormData({ ...formData, avatar: downloadUrl });
              dispatch(updateUserSuccess(data?.user));
              setProfilePhoto(null);
              return;
            } else {
              dispatch(updateUserFailure(data?.message));
            }
            dispatch(updateUserFailure(data?.message));
            alert(data?.message);
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE_URL}/api/auth/logout`);
      const data = await res.json();
      if (data?.success !== true) {
        dispatch(logOutFailure(data?.message));
        return;
      }
      dispatch(logOutSuccess());
      navigate("/login");
      alert(data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const CONFIRM = confirm(
      "Are you sure ? the account will be permenantly deleted!"
    );
    if (CONFIRM) {
      try {
        dispatch(deleteUserAccountStart());
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${API_BASE_URL}/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data?.success === false) {
          dispatch(deleteUserAccountFailure(data?.message));
          alert("Something went wrong!");
          return;
        }
        dispatch(deleteUserAccountSuccess());
        alert(data?.message);
      } catch (error) {}
    }
  };

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
  </div>
);

};

export default AdminPanel;
