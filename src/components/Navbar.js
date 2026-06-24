"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, ShoppingBag, User } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
    window.location.reload();
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Name */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/products")}>
          <ShoppingBag className="h-5 w-5 text-indigo-600" />
          <span className="text-lg font-bold text-gray-900">
            Product Listing App
          </span>
        </div>

        {/* User state and logout */}
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-gray-100 border border-gray-200 rounded text-gray-700 text-sm">
              <User className="h-4 w-4" />
              <span>User: {user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-sm bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 cursor-pointer font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push("/login")}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-650 hover:bg-indigo-700 rounded"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
