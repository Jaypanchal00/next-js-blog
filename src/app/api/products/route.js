import { NextResponse } from "next/server";
import { getProducts, addProduct } from "@/lib/store";

// Helper to check authorization
function isAuthorized(request) {
  const authHeader = request.headers.get("authorization");
  return authHeader && authHeader.startsWith("Bearer mock-jwt-token-");
}

export async function GET(request) {
  // Protect all product APIs as per requirements (User must log in before CRUD)
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized access. Please log in first." }, { status: 401 });
  }

  const products = getProducts();
  return NextResponse.json(products, { status: 200 });
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized access. Please log in first." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, price, description } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }
    
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ error: "Product price must be a positive number." }, { status: 400 });
    }

    if (!description || !description.trim()) {
      return NextResponse.json({ error: "Product description is required." }, { status: 400 });
    }

    const newProduct = addProduct({
      name: name.trim(),
      price: parsedPrice,
      description: description.trim(),
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to create product." }, { status: 400 });
  }
}
