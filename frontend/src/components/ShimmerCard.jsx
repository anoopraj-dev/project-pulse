const ShimmerCard = () => {
  return (
    <div className="animate-pulse space-y-4 p-4 border border-gray-200 rounded-md bg-white shadow-md w-full min-h-[200px]">
      <div className="flex items-center gap-4">
        <div className="bg-gray-300 rounded-full w-16 h-16"></div>
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      </div>
      <div className="space-y-3 mt-4">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
    </div>
  );
};

export default ShimmerCard;
