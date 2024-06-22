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

const AdminDashboard = () => {
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
            const res = await fetch(
              `/api/user/update-profile-photo/${currentUser._id}`,
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
      const res = await fetch("/api/auth/logout");
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
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
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
    <div className="flex justify-center items-center w-full min-h-screen p-4 bg-gray-100">
      {currentUser ? (
        <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="relative w-40 h-40">
              <img
                src={
                  (profilePhoto && URL.createObjectURL(profilePhoto)) ||
                  formData.avatar
                }
                alt="Profile photo"
                className="w-40 h-40 rounded-full object-cover cursor-pointer"
                onClick={() => fileRef.current.click()}
                onMouseOver={() => {
                  document.getElementById("photoLabel").classList.add("block");
                }}
                onMouseOut={() => {
                  document
                    .getElementById("photoLabel")
                    .classList.remove("block");
                }}
              />
              <input
                type="file"
                name="photo"
                id="photo"
                hidden
                ref={fileRef}
                accept="image/*"
                onChange={(e) => setProfilePhoto(e.target.files[0])}
              />
              <label
                htmlFor="photo"
                id="photoLabel"
                className="absolute bottom-0 w-full bg-gray-700 bg-opacity-75 text-white text-center py-2 rounded-b-full hidden cursor-pointer"
              >
                Choose Photo
              </label>
            </div>
            {profilePhoto && (
              <div className="w-full flex justify-center mt-4">
                <button
                  onClick={() => handleProfilePhoto(profilePhoto)}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all"
                >
                  {loading ? `Uploading...(${photoPercentage}%)` : "Upload"}
                </button>
              </div>
            )}
            <div className="w-full border-b border-gray-300 my-4">
              <span className="bg-white px-2 text-gray-700 text-lg font-semibold">
                Details
              </span>
            </div>
            <div className="w-full flex justify-between mb-4">
              <button
                onClick={handleLogout}
                className="text-red-500 font-semibold border border-red-600 py-2 px-4 rounded-md hover:bg-red-500 hover:text-white transition-all"
              >
                Log-out
              </button>
              {/* <button
                onClick={() => setActivePanelId(8)}
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-all"
              >
                Edit Profile
              </button> */}
              <Link to="/profile/editprofile" className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-all">
                <span>Edit Profile</span>
              </Link>
            </div>
            <div className="w-full bg-gray-50 shadow-inner rounded-lg p-4">
              <p className="text-2xl font-bold mb-2">
                Hi {currentUser.username}!
              </p>
              <p className="text-lg text-gray-700 mb-1">
                Email: {currentUser.email}
              </p>
              <p className="text-lg text-gray-700 mb-1">
                Phone: {currentUser.phone}
              </p>
              <p className="text-lg text-gray-700 mb-1">
                Address: {currentUser.address}
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="text-red-600 mt-4 hover:underline"
            >
              Delete account
            </button>
          </div>
        </div>
        
        
      ) : (
        <div className="text-red-700 text-xl">Login First</div>
      )}
    </div>
  );
};

export default AdminDashboard;
