// In-memory mock database for users and products
// Persistent across hot-reloads in Next.js development

if (!global.mockDb) {
  global.mockDb = {
    users: [], // Array of { id, name, email, password }
    products: [
      {
        id: "1",
        name: "iPhone 15 Pro Max",
        price: 140000,
        description: "Titanium design, A17 Pro chip, customizable Action button, and the most powerful iPhone camera system.",
      },
      {
        id: "2",
        name: "MacBook Pro 14-inch",
        price: 169900,
        description: "Supercharged by M3 chip, stunning Liquid Retina XDR display, up to 22 hours of battery life, and 8GB unified memory.",
      },
      {
        id: "3",
        name: "Sony WH-1000XM5",
        price: 29990,
        description: "Industry-leading noise canceling wireless headphones with auto optimizer, crystal clear hands-free calling, and Alexa built-in.",
      },
    ],
  };
}

const db = global.mockDb;

export function getUsers() {
  return db.users;
}

export function registerUser({ name, email, password }) {
  const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    throw new Error("User already exists with this email.");
  }
  const newUser = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    email: email.toLowerCase(),
    password, // Store as plain text for simplicity in mock db
  };
  db.users.push(newUser);
  return { id: newUser.id, name: newUser.name, email: newUser.email };
}

export function authenticateUser({ email, password }) {
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    throw new Error("Invalid email or password.");
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token: `mock-jwt-token-${user.id}-${Date.now()}`,
  };
}

export function getProducts() {
  return db.products;
}

export function getProductById(id) {
  return db.products.find((p) => p.id === id);
}

export function addProduct({ name, price, description }) {
  const newProduct = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    price: parseFloat(price) || 0,
    description,
  };
  db.products.push(newProduct);
  return newProduct;
}

export function updateProduct(id, { name, price, description }) {
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Product not found");
  }
  db.products[index] = {
    ...db.products[index],
    name,
    price: parseFloat(price) || 0,
    description,
  };
  return db.products[index];
}

export function deleteProduct(id) {
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Product not found");
  }
  const deleted = db.products.splice(index, 1);
  return deleted[0];
}
