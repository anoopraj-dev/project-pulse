

const ShimmerCard = () => {
  return (
    <div className="min-h-screen w-full animate-pulse bg-slate-50">

      {/* ---------- HERO SECTION ---------- */}
      <div
        className="relative min-h-screen flex items-center overflow-hidden pt-20"
        style={{
          background:
            "linear-gradient(140deg,#00131e 0%,#002e45 60%,#003f5c 100%)",
        }}
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 py-20 flex items-center justify-between gap-12">

          {/* Left text skeleton */}
          <div className="flex-1 space-y-6">
            <div className="h-4 w-40 bg-white/20 rounded"></div>
            <div className="h-14 w-3/4 bg-white/20 rounded"></div>
            <div className="h-14 w-2/3 bg-white/20 rounded"></div>
            <div className="h-4 w-2/3 bg-white/20 rounded"></div>
            <div className="h-4 w-1/2 bg-white/20 rounded"></div>

            <div className="flex gap-4 pt-4">
              <div className="h-10 w-40 bg-white/20 rounded-full"></div>
              <div className="h-10 w-36 bg-white/20 rounded-full"></div>
            </div>

            <div className="flex gap-10 pt-8">
              <div className="space-y-2">
                <div className="h-6 w-12 bg-white/20 rounded"></div>
                <div className="h-3 w-20 bg-white/20 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-6 w-12 bg-white/20 rounded"></div>
                <div className="h-3 w-20 bg-white/20 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-6 w-12 bg-white/20 rounded"></div>
                <div className="h-3 w-20 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>

          {/* Right illustration skeleton */}
          <div className="hidden lg:block w-[500px] h-[500px] bg-white/10 rounded-full"></div>
        </div>
      </div>

      {/* ---------- CONTENT SECTION ---------- */}
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-16">

        {/* Two column section */}
        <div className="grid md:grid-cols-2 gap-14">
          <div className="space-y-4">
            <div className="h-6 w-40 bg-gray-300 rounded"></div>
            <div className="h-10 w-3/4 bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
            <div className="h-10 w-40 bg-gray-300 rounded-full mt-4"></div>
          </div>

          <div className="h-64 bg-gray-300 rounded-3xl"></div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 space-y-3 border">
              <div className="w-14 h-14 bg-gray-300 rounded-xl"></div>
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
              <div className="h-3 w-24 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ShimmerCard;
