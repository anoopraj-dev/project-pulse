import { Icon } from "@iconify/react";

const PageBanner = ({
  config,
  isLoading,
  tabsComponent,
}) => {
  return (
    <div className=" z-40 w-full overflow-hidden ">
      <div className="my-2 mx-auto pb-1 sm:px-6 lg:px-8 w-full bg-gradient-to-br from-indigo-50 via-white to-sky-100 pt-5 pb-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              <Icon icon={config.icon} />
              {config.roleLabel} · {config.pageLabel}
            </p>

            <h1 className="mt-2 text-md text-slate-700 sm:text-lg  font-medium">
              {config.title}
            </h1>

            <p className="mt-2 max-w-xl text-sm text-slate-600">
              {config.description}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">

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