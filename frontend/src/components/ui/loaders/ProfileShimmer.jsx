

const ShimmerBlock = ({ className }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded-md ${className}`}
  />
);

const ProfileShimmer = () => {
  return (
    <div className="min-h-screen mt-18 flex flex-col items-center">
      <div className="flex flex-col w-md md:w-3xl lg:w-5xl p-10 gap-6">

        {/* -------- Header -------- */}
        <div className="p-6 rounded-xl shadow-sm bg-white space-y-4">
          <div className="flex items-center gap-6">
            <ShimmerBlock className="w-20 h-20 rounded-full" />
            <div className="flex flex-col gap-3">
              <ShimmerBlock className="h-6 w-56" />
              <ShimmerBlock className="h-4 w-40" />
            </div>
          </div>
        </div>

        {/* -------- Basic Info Cards -------- */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ShimmerBlock key={i} className="h-20 rounded-xl" />
          ))}
        </div>

        {/* -------- Action Buttons -------- */}
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ShimmerBlock key={i} className="h-10 w-36 rounded-xl" />
          ))}
        </div>

        {/* -------- About Section -------- */}
        <div className="space-y-3">
          <ShimmerBlock className="h-4 w-full" />
          <ShimmerBlock className="h-4 w-5/6" />
          <ShimmerBlock className="h-4 w-4/6" />
        </div>

        {/* -------- Services / Sections -------- */}
        <div className="space-y-4">
          <ShimmerBlock className="h-6 w-40" />
          {Array.from({ length: 3 }).map((_, i) => (
            <ShimmerBlock key={i} className="h-10 w-full" />
          ))}
        </div>

      </div>
    </div>
  );
};

export default ProfileShimmer;
