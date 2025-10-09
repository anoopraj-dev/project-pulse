import React from 'react';

const AuthImage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <img 
        src="./authbanner.webp" 
        alt="auth banner" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default AuthImage;
