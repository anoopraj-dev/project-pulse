import React from 'react';

const AuthImage = () => {
  return (
    <div className="relative w-full h-screen flex justify-center items-center overflow-hidden ">
      {/* Image */}
      <img
        src="./steth.jpg"
        alt="auth banner"
        className="w-full h-full object-cover object-left "
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-black/30 to-black/60" />
    </div>
  );
};

export default AuthImage;

