import { NextResponse } from "next/server";
import { updateProduct, deleteProduct } from "@/lib/store";

function isAuthorized(request) {
  const authHeader = request.headers.get("authorization");
  return authHeader && authHeader.startsWith("Bearer mock-jwt-token-");
}

export async function PUT(request, { params }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized access. Please log in first." }, { status: 401 });
  }

  try {
    const { id } = await params;
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

    const updated = updateProduct(id, {
      name: name.trim(),
      price: parsedPrice,
      description: description.trim(),
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update product." }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized access. Please log in first." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = deleteProduct(id);
    return NextResponse.json(
      { message: "Product deleted successfully!", deleted },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to delete product." }, { status: 400 });
  }
}
