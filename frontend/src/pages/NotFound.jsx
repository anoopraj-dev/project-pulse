import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! Page Not Found</p>
      <Link
        to="/"
        className="px-6 py-3 bg-[#0096C7] text-white rounded hover:bg-sky-600 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
