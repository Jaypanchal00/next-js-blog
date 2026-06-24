import "./globals.css";

export const metadata = {
  title: "Product Listing App",
  description: "Simple Next.js product listing app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
