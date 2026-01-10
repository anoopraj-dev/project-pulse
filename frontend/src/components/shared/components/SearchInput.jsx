import { Icon } from "@iconify/react";

const SearchInput = ({
  value,
  onChange,
  filter,
  onFilterChange,
  placeholder = "Search doctor ",
}) => {
  

  return (
    <div className="mt-6 rounded-2xl bg-white/80 backdrop-blur-sm p-4 sm:p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-4">
        {/* Search bar */}
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200 focus-within:ring-sky-300 focus-within:shadow-md transition-all duration-200">
          <Icon icon="mdi:magnify" className="h-5 w-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* Select + hint */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          {/* Custom styled select */}
          

          
          {/* Hint */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-50 to-cyan-50 px-3.5 py-1.5 text-[11px] font-medium text-sky-700 shadow-sm ring-1 ring-sky-100 self-start sm:self-auto">
            <Icon icon="mdi:shield-check-outline" className="h-3.5 w-3.5 flex-shrink-0" />
            Verified professionals only
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
