"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductModal from "@/components/ProductModal";
import { Plus, Edit2, Trash2, Tag, AlertCircle, RefreshCw } from "lucide-react";
import axios from "axios";

export default function ProductsPage() {
  const router = useRouter();
  
  // Auth state
  const [authorized, setAuthorized] = useState(false);
  const [token, setToken] = useState("");

  // Product state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Check auth
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.replace("/login");
    } else {
      setToken(storedToken);
      setAuthorized(true);
    }
  }, [router]);

  // Fetch products
  useEffect(() => {
    if (authorized && token) {
      fetchProducts();
    }
  }, [authorized, token]);

  const fetchProducts = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await axios.get("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Failed to load products.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (productData) => {
    try {
      if (editingProduct) {
        const response = await axios.put(`/api/products/${editingProduct.id}`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? response.data : p))
        );
        setMessage({ type: "success", text: "Product updated successfully!" });
      } else {
        const response = await axios.post("/api/products", productData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts((prev) => [...prev, response.data]);
        setMessage({ type: "success", text: "Product added successfully!" });
      }
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Operation failed.";
      setMessage({ type: "error", text: errMsg });
      throw error;
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setActionLoading(id);
    setMessage({ type: "", text: "" });
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setMessage({ type: "success", text: "Product deleted successfully!" });
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Failed to delete product.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setActionLoading(null);
    }
  };

  if (!authorized) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 pb-12">
      {/* Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 mt-8 w-full flex-grow">
        
        {/* Title Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Product Listing
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Add, view, edit or delete products in your store list.
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="p-2 border border-gray-300 hover:bg-gray-100 rounded text-gray-700 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
            </button>
            
            <button
              onClick={handleAddProduct}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium text-sm cursor-pointer shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Global Toast Alert */}
        {message.text && (
          <div className={`mb-4 p-3 rounded border text-xs font-semibold flex items-center space-x-2 ${
            message.type === "success" 
              ? "bg-green-50 border-green-200 text-green-700" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        {/* Product Grid Layout */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-gray-200 rounded p-4 space-y-3 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-12 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded bg-white">
            <Tag className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <h3 className="text-md font-semibold text-gray-700">No products available</h3>
            <button
              onClick={handleAddProduct}
              className="mt-3 px-3 py-1.5 text-xs bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100 rounded cursor-pointer"
            >
              Add a Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col justify-between bg-white border border-gray-200 rounded p-4 shadow-xs"
              >
                <div>
                  <div className="flex justify-between items-start space-x-2">
                    <h3 className="text-md font-bold text-gray-800">
                      {product.name}
                    </h3>
                    <div className="text-sm font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5">
                      ₹{product.price ? product.price.toLocaleString("en-IN") : "0"}
                    </div>
                  </div>

                  <p className="text-gray-600 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Operations */}
                <div className="flex items-center space-x-2 border-t border-gray-100 pt-3 mt-4">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex items-center justify-center space-x-1 flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={actionLoading === product.id}
                    className="flex items-center justify-center space-x-1 flex-1 px-3 py-1.5 text-xs border border-red-200 rounded text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading === product.id ? (
                      <span>Deleting...</span>
                    ) : (
                      <>
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        product={editingProduct}
      />
    </div>
  );
}
