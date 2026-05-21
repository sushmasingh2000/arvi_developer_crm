import { useFormik } from "formik";
import React, { useState } from "react";
import { AiFillLock, AiOutlineMail } from "react-icons/ai";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../Shared/Loader";
import logo from "../../../assets/mobile_logo.png";

const LogIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fk = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: () => {
      loginFunction({
        crm_name: fk.values.username,
        crm_password: fk.values.password,
      });
    },
  });

  const loginFunction = async (reqBody) => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        API_URLS.admin_login,
        reqBody
      );

      if (response?.data?.success) {
        toast.success(response?.data?.msg);

        localStorage.setItem("token", response?.data?.response?.[0]?.token);
        localStorage.setItem("type", response?.data?.response?.[0]?.usertype);

        navigate("/admindashboard");
        window.location.reload();
      } else {
        toast.error(response?.data?.msg);
      }
    } catch (error) {
      toast.error("Login Failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[var(--bg-dark)]"></div>

      <Loader isLoading={loading} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[360px]">

        <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--primary)]/20 rounded-2xl p-5 shadow-lg">

          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src={logo} className="w-16" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-center text-[var(--primary)]">
            Welcome Back
          </h2>

          <p className="text-center text-gray-400 text-xs mb-5">
            Login to your admin panel
          </p>

          {/* Form */}
          <form onSubmit={fk.handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="text-xs text-gray-300">Username</label>

              <div className="mt-1 flex items-center bg-[var(--input-bg)] border border-[var(--primary)]/20 rounded-lg focus-within:border-[var(--primary)]">

                <input
                  type="text"
                  name="username"
                  value={fk.values.username}
                  onChange={fk.handleChange}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 text-sm bg-transparent text-white outline-none"
                />

                <div className="px-3 text-[var(--primary)]">
                  <AiOutlineMail size={18} />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-gray-300">Password</label>

              <div className="mt-1 flex items-center bg-[var(--input-bg)] border border-[var(--primary)]/20 rounded-lg focus-within:border-[var(--primary)]">

                <input
                  type="password"
                  name="password"
                  value={fk.values.password}
                  onChange={fk.handleChange}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 text-sm bg-transparent text-white outline-none"
                />

                <div className="px-3 text-[var(--primary)]">
                  <AiFillLock size={18} />
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-black text-sm font-semibold py-2 rounded-lg transition-all duration-300"
            >
              Login Now
            </button>

            {/* Footer line */}
            <div className="flex items-center gap-2 mt-4">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent"></div>
              <div className="w-2 h-2 bg-[var(--primary)] rounded-full"></div>
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent"></div>
            </div>

            <p className="text-center text-[10px] text-gray-500 mt-2">
              CRM PANEL
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;