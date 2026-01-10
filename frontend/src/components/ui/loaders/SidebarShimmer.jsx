const SidebarShimmer = () => {
  return (
    <div className="h-screen animate-pulse bg-gray-300 p-4 space-y-6 mt-15">
      <div className="flex justify-end">
        <div className="w-8 h-8 bg-white/30 rounded-md" />
      </div>

      <div className="flex justify-center mt-6">
        <div className="w-28 h-28 bg-white/30 rounded-full" />
      </div>

      <ul className="space-y-4 mt-8">
        {Array.from({ length: 7 }).map((_, idx) => (
          <li key={idx} className="flex items-center gap-4 px-6">
            <div className="w-6 h-6 bg-white/30 rounded-md" />
            <div className="h-4 w-32 bg-white/30 rounded" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarShimmer;
