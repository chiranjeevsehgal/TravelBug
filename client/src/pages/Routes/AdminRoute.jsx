import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const [ok, setOk] = useState(false);

  const authCheck = async () => {
    const token = localStorage.getItem('accessToken');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
    const res = await fetch(`${API_BASE_URL}/api/user/admin-auth`, {
      method: "GET",
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    const data = await res.json();
    if (data.check) setOk(true);
    else setOk(false);
  };

  useEffect(() => {
    if (currentUser !== null) authCheck();
  }, [currentUser]);

  return ok ? <Outlet /> : <Spinner />;
}
