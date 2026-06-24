"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2, Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/products");
    }
  }, [router]);

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) {
      tempErrors.name = "Full Name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      tempErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setMessage({ type: "success", text: response.data.message || "Registration successful! Redirecting..." });
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Registration failed.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center min-h-[85vh] bg-gray-50 px-4 text-gray-900">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <ShoppingBag className="h-6 w-6 text-indigo-650 mb-2" />
          <h2 className="text-xl font-bold text-gray-800">User Registration</h2>
          <p className="text-gray-500 text-xs mt-1">Please register to create an account</p>
        </div>

        {/* Success / Error Messages */}
        {message.text && (
          <div className={`mb-4 p-2.5 rounded border text-xs font-semibold ${
            message.type === "success" 
              ? "bg-green-50 border-green-200 text-green-700" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="reg-name" className="block text-xs font-bold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="reg-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              disabled={loading}
              className={`w-full px-3 py-2 rounded bg-white text-gray-900 border text-sm focus:outline-none focus:border-indigo-500 ${
                errors.name ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <span className="block mt-1 text-xs text-red-500">{errors.name}</span>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="block text-xs font-bold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              disabled={loading}
              className={`w-full px-3 py-2 rounded bg-white text-gray-900 border text-sm focus:outline-none focus:border-indigo-500 ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <span className="block mt-1 text-xs text-red-500">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="reg-password" className="block text-xs font-bold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (min 6 chars)"
                disabled={loading}
                className={`w-full px-3 py-2 rounded bg-white text-gray-900 border text-sm focus:outline-none focus:border-indigo-500 ${
                  errors.password ? "border-red-400" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="block mt-1 text-xs text-red-500">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="reg-confirm" className="block text-xs font-bold text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="reg-confirm"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              disabled={loading}
              className={`w-full px-3 py-2 rounded bg-white text-gray-900 border text-sm focus:outline-none focus:border-indigo-500 ${
                errors.confirmPassword ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <span className="block mt-1 text-xs text-red-500">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center space-x-1.5 w-full py-2.5 rounded bg-indigo-650 hover:bg-indigo-700 text-white font-semibold cursor-pointer text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Registering...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </button>
        </form>

        {/* Footer Redirect */}
        <div className="text-center mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            Already registered?{" "}
            <span 
              onClick={() => router.push("/login")}
              className="font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              Log In
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
