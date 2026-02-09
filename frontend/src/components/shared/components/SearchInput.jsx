import { Icon } from "@iconify/react";
import { useTypeahead } from "../../../hooks/useTypeahead";
import { useState, useEffect } from "react";
import { SEARCH_HINTS } from "../configs/searchInputHintsConfig";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search doctor",
  onSelectSuggestion,
  fetchSuggestions,
  role,
  entity,
}) => {
  const { suggestions, loading } = useTypeahead({
    query: value,
    apiCall: fetchSuggestions,
    delay: 300,
  });

  const [showSuggestions, setShowSuggestions] = useState(false);

  const hint = SEARCH_HINTS?.[role]?.[entity] || SEARCH_HINTS.user.doctors;

  // Hide suggestions when input becomes empty
  useEffect(() => {
    if (!value) setShowSuggestions(false);
  }, [value]);

  return (
    <div className=" relative rounded-2xl bg-white/80 backdrop-blur-sm p-4 sm:p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-4">
        {/* Search bar */}
        <div className="relative">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200 focus-within:ring-sky-300 focus-within:shadow-md transition-all duration-200">
            <Icon
              icon="mdi:magnify"
              className="h-5 w-5 text-slate-400 flex-shrink-0"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => {
                onChange(e);
                setShowSuggestions(true);
              }}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full max-h-72 rounded-2xl bg-gray-100  shadow-lg ring-1 ring-slate-200 overflow-hidden">
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    onSelectSuggestion(item);
                    setShowSuggestions(false);
                  }}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-50 transition"
                >
                  <p className="text-sm font-medium text-slate-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.specialization} {item.location}
                  </p>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="absolute right-4 top-3 text-xs text-slate-400">
              Loading...
            </div>
          )}
        </div>

        {/* Hint */}
        {hint && (
          <div
            className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${hint.bg}
      px-3.5 py-1.5 text-[11px] font-medium ${hint.textColor}
      shadow-sm ring-1 ${hint.ring} self-start sm:self-auto`}
          >
            <Icon icon={hint.icon} className="h-3.5 w-3.5 flex-shrink-0" />
            {hint.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
