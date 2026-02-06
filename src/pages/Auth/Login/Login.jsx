import React, { useState } from "react";
import { FaUserLock, FaEye, FaEyeSlash, FaGavel, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import usePageTitle from "../../../Hooks/useTitle";

const Login = () => {
  usePageTitle("Login");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("advocate");

  const [showForgot, setShowForgot] = useState(false);
  const [forgotRole, setForgotRole] = useState("advocate");

  const isAdvocate = role === "advocate";

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    console.log({ email, password, role });
  };

  // 🔐 FORGOT PASSWORD
  const handleForgotPassword = (e) => {
    e.preventDefault();

    const email = e.target.forgotEmail.value;

    if (!email) {
      Swal.fire("Error", "Email is required", "error");
      return;
    }

    setShowForgot(false);

    Swal.fire({
      icon: "success",
      title: "Password Reset Requested",
      html: `
    <p style="margin-bottom:6px;">
      A password reset link has been sent to
    </p>
    <strong style="color:#10b981;">${email}</strong>
    <br/>
    <small style="color:#9ca3af;">
      Role: ${forgotRole === "advocate" ? "Advocate Panel" : "User Panel"}
    </small>
  `,
      background: "#0f172a",
      color: "#e5e7eb",
      iconColor: "#10b981",
      confirmButtonText: "Got it",
      confirmButtonColor: "#10b981",
      showCloseButton: true,
    });

    console.log({ email, forgotRole });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-8">
        {/* ROLE SWITCH */}
        <div className="flex mb-6 bg-slate-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setRole("advocate")}
            className={`flex-1 py-2 text-sm font-semibold ${
              isAdvocate
                ? "bg-emerald-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🧑‍⚖️ Advocate Panel
          </button>
          <button
            onClick={() => setRole("user")}
            className={`flex-1 py-2 text-sm font-semibold ${
              !isAdvocate
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            👤 User Panel
          </button>
        </div>

        {/* BRANDING */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div
              className={`p-4 rounded-full ${isAdvocate ? "bg-emerald-500/20" : "bg-blue-500/20"}`}
            >
              {isAdvocate ? (
                <FaGavel className="text-emerald-400 text-3xl" />
              ) : (
                <FaUser className="text-blue-400 text-3xl" />
              )}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isAdvocate ? "Advocate Panel" : "User Panel"}
          </h1>
          <p className="text-gray-400 text-sm">Case Management System</p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded text-sm">
            🚫 {error}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              className="w-full mt-1 px-4 py-2 rounded bg-slate-800 text-white border border-slate-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <label className="text-gray-400 flex gap-2">
              <input type="checkbox" /> Remember me
            </label>
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-emerald-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            className={`w-full py-2 rounded text-white font-semibold flex justify-center gap-2 ${
              isAdvocate
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <FaUserLock /> Login
          </button>
        </form>

        {/* FORGOT PASSWORD MODAL */}
        {showForgot && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-900 p-6 rounded-lg w-full max-w-sm border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                🔐 Forgot Password
              </h2>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <select
                  value={forgotRole}
                  onChange={(e) => setForgotRole(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-600"
                >
                  <option value="advocate">Advocate</option>
                  <option value="user">User</option>
                </select>

                <input
                  type="email"
                  name="forgotEmail"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-600"
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <p className="text-center text-gray-500 text-xs mt-6">
          © {new Date().getFullYear()} Case Management System
        </p>
      </div>
    </div>
  );
};

export default Login;
