import { Icon } from "@iconify/react";

const PageBanner = ({
  config,
  activeTab,
  isLoading,
  tabsComponent,
  count
}) => {
  return (
    <div className=" z-40 w-full overflow-hidden rounded-xl ">
      <div className="my-2 rounded-xl mx-auto pb-1 sm:px-6 lg:px-8 w-full bg-gradient-to-br from-indigo-50 via-white to-sky-100 pt-5 pb-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              <Icon icon={config.icon} />
              {config.roleLabel} · {config.pageLabel}
            </p>

            <h1 className="mt-2 text-xl text-slate-700 sm:text-4xl font-[Georgia] font-medium">
              {config.title}
            </h1>

            <p className="mt-2 max-w-xl text-sm text-slate-600">
              {config.description}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm ring-1 ring-slate-200">
              <Icon icon="mdi:circle" className="text-[10px] text-emerald-500" />
              <span className="capitalize font-semibold text-slate-900">
                    {count}
                </span>
              <span>
                {config.activeTabLabel}:{" "}
                
                <span className="capitalize font-semibold text-slate-900">
                  {activeTab}
                </span>
              </span>
            </div>

            {isLoading && (
              <span className="inline-flex items-center gap-2 text-[11px] text-slate-500">
                <Icon icon="mdi:loading" className="animate-spin text-indigo-500" />
                {config.loadingText}
              </span>
            )}
          </div>
        </div>

        {tabsComponent && (
          <div className="mt-2">
            {tabsComponent}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageBanner;