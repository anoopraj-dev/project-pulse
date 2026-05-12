import React from "react";

const Skeleton = ({ className = "", variant = "rect", width, height }) => {
  const baseClasses = "animate-pulse bg-slate-200 rounded";
  
  const variantClasses = {
    rect: "",
    circle: "rounded-full",
    text: "h-4 w-full mb-2",
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex space-x-4 border-b border-slate-100 pb-4">
        {[...Array(cols)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex space-x-4 py-4">
          {[...Array(cols)].map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circle" className="h-12 w-12" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="rect" className="h-4 w-1/2" />
          <Skeleton variant="rect" className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton variant="rect" className="h-32 w-full" />
      <div className="flex justify-between items-center pt-4">
        <Skeleton variant="rect" className="h-8 w-24" />
        <Skeleton variant="rect" className="h-8 w-24" />
      </div>
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <Skeleton variant="circle" className="h-10 w-10" />
          <div className="space-y-2 flex-1">
            <Skeleton variant="rect" className="h-3 w-2/3" />
            <Skeleton variant="rect" className="h-6 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
