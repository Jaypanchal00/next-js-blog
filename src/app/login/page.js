"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      tempErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required.";
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
      const response = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, id, name, email, message: successMsg } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ id, name, email }));

      setMessage({ type: "success", text: successMsg || "Login successful! Redirecting..." });

      setTimeout(() => {
        router.push("/products");
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Invalid email or password.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center min-h-[85vh] bg-gray-50 px-4 text-gray-900">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <ShoppingBag className="h-6 w-6 text-indigo-650 mb-2" />
          <h2 className="text-xl font-bold text-gray-800">User Login</h2>
          <p className="text-gray-500 text-xs mt-1">Please sign in to access products</p>
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
          
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="block text-xs font-bold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="login-email"
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
            <label htmlFor="login-password" className="block text-xs font-bold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer Redirect */}
        <div className="text-center mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            Don't have an account?{" "}
            <span 
              onClick={() => router.push("/register")}
              className="font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              Register Now
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
