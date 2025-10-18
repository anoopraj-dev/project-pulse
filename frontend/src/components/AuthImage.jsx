import React from 'react';

const AuthImage = () => {
  return (
    <div className="relative w-full h-screen flex justify-center items-center overflow-hidden">
  <img
    src="./loginbanner.jpg"
    alt="auth banner"
    className="w-full h-full object-cover object-center"
    style={{
      WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
      maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
    }}
  />
</div>
  );
};

export default AuthImage;
