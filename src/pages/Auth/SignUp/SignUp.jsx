import React, { useState } from "react";
import { FaUserLock, FaEye, FaEyeSlash, FaGavel, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import usePageTitle from "../../../Hooks/useTitle";

const SignUp = () => {
  usePageTitle("Sign Up");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("advocate"); // advocate | user

  const isAdvocate = role === "advocate";

  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const branch = e.target.branch.value.trim();

    // Validation
    if (!name || !email || !password || !branch) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // ✅ Future: send data to backend
    console.log({ name, email, password, branch, role });

    // SweetAlert Success
    Swal.fire({
      icon: "success",
      title: "Account Created",
      html: `
        <p>Welcome <strong>${name}</strong></p>
        <p>Email: <strong>${email}</strong></p>
        <p>Role: <strong>${role === "advocate" ? "Advocate" : "User"}</strong></p>
      `,
      background: "#0f172a",
      color: "#e5e7eb",
      iconColor: "#10b981",
      confirmButtonText: "Continue",
      confirmButtonColor: "#10b981",
      showCloseButton: true,
    });

    e.target.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-8">

        {/* ROLE SWITCH */}
        <div className="flex mb-6 bg-slate-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setRole("advocate")}
            className={`flex-1 py-2 text-sm font-semibold transition ${
              isAdvocate
                ? "bg-emerald-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🧑‍⚖️ Advocate
          </button>
          <button
            onClick={() => setRole("user")}
            className={`flex-1 py-2 text-sm font-semibold transition ${
              !isAdvocate
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            👤 User
          </button>
        </div>

        {/* Branding */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div
              className={`p-4 rounded-full ${
                isAdvocate ? "bg-emerald-500/20" : "bg-blue-500/20"
              }`}
            >
              {isAdvocate ? (
                <FaGavel className="text-emerald-400 text-3xl" />
              ) : (
                <FaUser className="text-blue-400 text-3xl" />
              )}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isAdvocate ? "Advocate Sign Up" : "User Sign Up"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Case Management System
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded text-sm">
            🚫 {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="mt-1 w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-600 focus:outline-none focus:border-emerald-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Branch Name */}
          <div>
            <label className="text-sm text-gray-300">Branch Name</label>
            <input
              type="text"
              name="branch"
              placeholder="Enter your branch"
              className="mt-1 w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className={`w-full py-2 rounded transition text-white font-semibold flex items-center justify-center gap-2 ${
              isAdvocate
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <FaUserLock />
            Sign Up as {isAdvocate ? "Advocate" : "User"}
          </button>
        </form>

        {/* Footer: Login Navigation */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
