"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/products");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex flex-col flex-grow items-center justify-center min-h-[70vh] bg-gray-50 text-gray-800">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
