import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import {
  signupStart,
  signupSuccess,
  signupFailure,
} from "../redux/user/userSlice.js";

const Signup = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const { loading, error } = useSelector((state) => state.user);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // const sendOTP = async () => {
  //   // e.preventDefault();
  //   try {
  //     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  //     const to = "chiranjeevsehgal@gmail.com"
  //     const subject = "Registering"
  //     const html = "Welcome to travelbugg!"

  //     const response = await axios.post(`${API_BASE_URL}/send-email`, {
  //       body: JSON.stringify({ to, subject, html }),
  //     });
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'Failed to send email');
  //     }

  //     const result = await response.json();
  //     console.log('Email sent successfully:', result.data);
  //     return result.data;
  //   } catch (error) {
  //     console.error('Error sending email:', error.message);
  //     throw error;
  //   }
  // };

  const sendOTP = async (to, subject, html) => {
    try {
      // const to = "chiranjeevsehgal@gmail.com"
      // const subject = "Registering"
      // const html = "Welcome to travelbugg!"

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ to, subject, html }),

        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      const data = await response.json();
      console.log("Email sent successfully.");
    } catch (error) {
      console.log(error);
      console.error("Error sending email:", error);

      return;
    }
  };

  async function navigations() {

    const sixDigitCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const email = formData.email
    const name = formData.username
    const emailTemplate = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Verification Code | OnClique</title>
            <style>
              body, html {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
              }

              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border: 1px solid #ddd;
                border-radius: 8px;
              }

              .heading {
                font-size: 24px;
                font-weight: bold;
                color: #333;
                margin-bottom: 20px;
              }

              .text {
                font-size: 16px;
                color: #555;
                line-height: 1.5;
                margin-bottom: 20px;
              }

              .textFooter {
                font-size: 13px;
                color: #555;
                line-height: 1;
                margin-bottom: 7px;
              }

              .code {
                font-size: 20px;
                font-weight: bold;
                color: #333;
                background-color: #f0f0f0;
                padding: 10px;
                border-radius: 4px;
                display: inline-block;
                margin-bottom: 20px;
              }

              .footer {
                font-size: 14px;
                color: #777;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 class="heading">Hello ${name},</h1>
              <p class="text">
                Thank you for registering on TravelBug! Please use the verification code below to complete your registration. If you did not request this code, please ignore this email.
              </p>
              <center><div class="code">${sixDigitCode}</div></center>
              <p class="text">
                If you have any questions or need assistance, please revert to this email.
              </p>
              <div class="footer">
                <p class="textFooter">Regards,</p>
                <strong><p class="textFooter">Chiranjeev Sehgal</p></strong>
              </div>
            </div>
          </body>
        </html>
        `;

    sendOTP(email, "Verification Code | TravelBug", emailTemplate);

  }


  // useEffect(() => {
  //   let flag = false;
  //   const sendEmail = async (to, subject, html) => {
  //     try {
  //       const response = await fetch(
  //         ${ import.meta.env.VITE_API_URL } / send - email,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ to, subject, html }),
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error("Failed to send email");
  //       }

  //       const data = await response.json();
  //       console.log("Email sent successfully.");
  //     } catch (error) {
  //       flag = true;
  //       console.error("Error sending email:", error);
  //       setIsVerifiedState(false);
  //       await signOut(auth);
  //       navigate("/login", {
  //         state: { fromLanding: true },
  //       });
  //       return;
  //     }
  //   };

  //   async function navigations() {
  //     if (!isVerifiedState) {
  //       const sixDigitCode = Math.floor(
  //         100000 + Math.random() * 900000
  //       ).toString();

  //       const userRef = doc(db, "users", userUid);
  //       await setDoc(userRef, {
  //         name: name,
  //         email: email,
  //         isVerified: isVerifiedState,
  //         otp: sixDigitCode,
  //       });

  //       const emailTemplate = `
  //       <!DOCTYPE html>
  //       <html lang="en">
  //         <head>
  //           <meta charset="UTF-8" />
  //           <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //           <title>Verification Code | OnClique</title>
  //           <style>
  //             body, html {
  //               margin: 0;
  //               padding: 0;
  //               font-family: Arial, sans-serif;
  //             }

  //             .container {
  //               max-width: 600px;
  //               margin: 0 auto;
  //               padding: 20px;
  //               background-color: #ffffff;
  //               border: 1px solid #ddd;
  //               border-radius: 8px;
  //             }

  //             .heading {
  //               font-size: 24px;
  //               font-weight: bold;
  //               color: #333;
  //               margin-bottom: 20px;
  //             }

  //             .text {
  //               font-size: 16px;
  //               color: #555;
  //               line-height: 1.5;
  //               margin-bottom: 20px;
  //             }

  //             .textFooter {
  //               font-size: 13px;
  //               color: #555;
  //               line-height: 1;
  //               margin-bottom: 7px;
  //             }

  //             .code {
  //               font-size: 20px;
  //               font-weight: bold;
  //               color: #333;
  //               background-color: #f0f0f0;
  //               padding: 10px;
  //               border-radius: 4px;
  //               display: inline-block;
  //               margin-bottom: 20px;
  //             }

  //             .footer {
  //               font-size: 14px;
  //               color: #777;
  //               margin-top: 20px;
  //             }
  //           </style>
  //         </head>
  //         <body>
  //           <div class="container">
  //             <h1 class="heading">Hello ${name},</h1>
  //             <p class="text">
  //               Thank you for registering on OnClique! Please use the verification code below to complete your registration. If you did not request this code, please ignore this email.
  //             </p>
  //             <center><div class="code">${sixDigitCode}</div></center>
  //             <p class="text">
  //               If you have any questions or need assistance, please revert to this email.
  //             </p>
  //             <div class="footer">
  //               <p class="textFooter">Regards,</p>
  //               <strong><p class="textFooter">Developers at OnClique</p></strong>
  //             </div>
  //           </div>
  //         </body>
  //       </html>
  //       `;

  //       sendEmail(email, "Verification Code | OnClique", emailTemplate);
  //       if (flag) return;

  //       navigate("/verify", {
  //         state: { uid: userUid },
  //       });
  //       return;
  //     } else {
  //       if (adminsUidsGlobal.includes(userUid)) {
  //         navigate("/accSelect");
  //         return;
  //       } else {
  //         navigate("/dashboard");
  //         return;
  //       }
  //     }
  //   }
  //   if (name && email && adminsUidsGlobal) navigations();
  // }, [globalFlag]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signupStart());
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, formData);
      if (res?.data?.success) {
        await navigations();
        dispatch(signupSuccess(res?.data?.user)); // Assuming the API returns user data
        toast.success(res?.data?.message);
        navigate("/login");
      } else {
        dispatch(signupFailure(res?.data?.message));
        toast.error(res?.data?.message);
      }
    } catch (error) {
      dispatch(signupFailure(error.message));
      console.log(error);
      toast.error("An error occurred during signup");
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-100 py-10 px-5">
      <div className="flex flex-col lg:flex-row shadow-lg rounded-lg overflow-hidden bg-white w-full max-w-4xl">
        {/* Signup form */}
        <div className="flex flex-col justify-center p-8 w-full lg:w-1/2">
          <div className="w-full">
            <h1 className="text-2xl font-semibold mb-2">Create an account</h1>
            <p className="text-gray-500 mb-6">Please enter your details to sign up</p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="username">Username</label>
                <input type="text" id="username" placeholder="Enter your username" className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700" onChange={handleChange} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700" onChange={handleChange} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="*****" className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700" onChange={handleChange} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="address">Address</label>
                <textarea id="address" placeholder="Enter your address" className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700" onChange={handleChange} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" htmlFor="phone">Phone</label>
                <input type="text" id="phone" placeholder="Enter your phone number" className="block w-full rounded-md border border-gray-300 focus:border-[#41A4FF] focus:outline-none focus:ring-1 focus:ring-[#41A4FF] py-2 px-3 text-gray-700" onChange={handleChange} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-center text-white bg-[#41A4FF] hover:bg-[#41A4FF] py-2 rounded-md mb-4 disabled:opacity-50"
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
              <button className="flex items-center justify-center w-full border border-gray-300 hover:border-gray-500 py-2 rounded-md">
                <img className="w-5 h-5 mr-2" src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="Google logo" />
                Sign up with Google
              </button>
            </form>
            {error && <p className="text-sm text-center text-red-600 mt-3">{error}</p>}
            <div className="text-center mt-6">
              <span className="text-sm text-gray-500">Already have an account?</span>
              <Link to="/login" className="text-sm font-semibold text-[#41A4FF] ml-1">Sign in</Link>
            </div>
          </div>
        </div>

        {/* Signup banner - only visible on larger screens */}
        <div className="hidden lg:flex items-center justify-center w-full lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/images/login.jpg')" }}>
          {/* Overlay for better text contrast */}
          <div className="w-full h-fullopacity-50"></div>
        </div>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
};

export default Signup;
