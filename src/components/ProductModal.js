"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

export default function ProductModal({ isOpen, onClose, onSubmit, product = null }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPrice(product.price ? product.price.toString() : "");
      setDescription(product.description || "");
      setErrors({});
      setApiError("");
    } else {
      setName("");
      setPrice("");
      setDescription("");
      setErrors({});
      setApiError("");
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) {
      tempErrors.name = "Product name is required.";
    }
    
    if (!price.trim()) {
      tempErrors.price = "Price is required.";
    } else {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice)) {
        tempErrors.price = "Price must be a valid number.";
      } else if (parsedPrice <= 0) {
        tempErrors.price = "Price must be greater than zero.";
      }
    }

    if (!description.trim()) {
      tempErrors.description = "Description is required.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      await onSubmit({
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
      });
      onClose();
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.error || err.message || "Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-md mx-4 bg-white border border-gray-250 rounded-lg shadow-xl overflow-hidden z-10 text-gray-900">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-md font-bold text-gray-800">
            {product ? "Edit Product" : "Add Product"}
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-650 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {apiError && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-semibold">
              {apiError}
            </div>
          )}

          {/* Product Name */}
          <div>
            <label htmlFor="modal-name" className="block text-xs font-bold text-gray-750 mb-1">
              Product Name
            </label>
            <input
              id="modal-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              className={`w-full px-3 py-2 rounded bg-white text-gray-900 border text-sm focus:outline-none focus:border-indigo-500 ${
                errors.name ? "border-red-400 focus:border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <span className="block mt-1 text-xs text-red-500">{errors.name}</span>
            )}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="modal-price" className="block text-xs font-bold text-gray-750 mb-1">
              Price (₹)
            </label>
            <input
              id="modal-price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 29999"
              className={`w-full px-3 py-2 rounded bg-white text-gray-900 border text-sm focus:outline-none focus:border-indigo-500 ${
                errors.price ? "border-red-400 focus:border-red-500" : "border-gray-300"
              }`}
            />
            {errors.price && (
              <span className="block mt-1 text-xs text-red-500">{errors.price}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="modal-desc" className="block text-xs font-bold text-gray-750 mb-1">
              Description
            </label>
            <textarea
              id="modal-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              className={`w-full px-3 py-2 rounded bg-white text-gray-900 border text-sm focus:outline-none focus:border-indigo-500 resize-none ${
                errors.description ? "border-red-400 focus:border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <span className="block mt-1 text-xs text-red-500">{errors.description}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-750 hover:bg-gray-100 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-semibold cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
