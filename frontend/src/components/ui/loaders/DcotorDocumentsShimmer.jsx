const DoctorDocumentsShimmer = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-16 animate-pulse">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="h-6 w-64 mx-auto bg-slate-300 rounded" />
          <div className="h-4 w-96 mx-auto bg-slate-200 rounded" />
        </div>

        {/* Medical License */}
        <div className="space-y-6">
          <div className="h-6 w-72 bg-slate-300 rounded" />

          {/* Info row */}
          <div className="flex gap-10">
            <div className="h-5 w-40 bg-slate-200 rounded" />
            <div className="h-5 w-40 bg-slate-200 rounded" />
            <div className="h-5 w-40 bg-slate-200 rounded" />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 flex-wrap">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-24 h-24 bg-slate-200 rounded-lg"
              />
            ))}
          </div>

          {/* Info message */}
          <div className="h-12 w-full bg-slate-200 rounded-md" />
        </div>

        {/* Education */}
        <div className="space-y-6">
          <div className="h-6 w-40 bg-slate-300 rounded" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-4 border border-slate-200 rounded-lg bg-white space-y-3"
              >
                <div className="h-5 w-2/3 bg-slate-300 rounded" />
                <div className="h-4 w-1/2 bg-slate-200 rounded" />
                <div className="h-4 w-1/3 bg-slate-200 rounded" />
                <div className="h-32 w-full bg-slate-200 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-6">
          <div className="h-6 w-40 bg-slate-300 rounded" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-4 border border-slate-200 rounded-lg bg-white space-y-3"
              >
                <div className="h-5 w-2/3 bg-slate-300 rounded" />
                <div className="h-4 w-1/2 bg-slate-200 rounded" />
                <div className="h-4 w-1/3 bg-slate-200 rounded" />
                <div className="h-32 w-full bg-slate-200 rounded-md" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorDocumentsShimmer;
