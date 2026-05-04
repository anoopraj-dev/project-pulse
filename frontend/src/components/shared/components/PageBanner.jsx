import { Icon } from "@iconify/react";

const PageBanner = ({
  config,
  isLoading,
}) => {
  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className=" mx-auto px-2 md:px-6 lg:px-8 py-1 sm:py-2">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#0096C7]">
              <Icon icon={config.icon} className="text-sm" />
              <span>{config.roleLabel}</span>
              <span className="text-gray-300">•</span>
              <span>{config.pageLabel}</span>
            </div>

            <h1 className="text-lg sm:text-xl font-medium text-gray-900 tracking-tight">
              {config.title}
            </h1>

            <p className="max-w-2xl text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
              {config.description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {isLoading && (
              <div className="flex items-center gap-2.5 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                <Icon icon="ph:spinner-gap-bold" className="animate-spin text-[#0096C7] text-sm" />
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  {config.loadingText || 'Loading...'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageBanner;