import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useTypeahead } from "../../../hooks/useTypeahead";
import { fetchSearchSuggestions } from "../../../api/user/userApis";

const ApplyFilters = ({ config, onApply }) => {
  // ---------------- Initial states ----------------
  const initialEnabled = config.reduce((acc, f) => {
    acc[f.key] = false;
    return acc;
  }, {});

  const initialValues = config.reduce((acc, f) => {
    acc[f.key] = "";
    return acc;
  }, {});

  const [enabled, setEnabled] = useState(initialEnabled);
  const [values, setValues] = useState(initialValues);
  const [activeField, setActiveField] = useState(null);

  // ---------------- Typeahead hook  ----------------
  const activeQuery = activeField ? values[activeField] : "";

  const { suggestions, loading } = useTypeahead({
    query: activeQuery,
    apiCall: (query) =>
      fetchSearchSuggestions({
        role: "patient",
        query,
        type: activeField, 
      }),
  });


  // ---------------- Toggle filter ----------------
  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setEnabled((prev) => ({ ...prev, [name]: checked }));

    if (!checked) {
      setValues((prev) => ({ ...prev, [name]: "" }));
      setActiveField(null);
    }
  };

  // ---------------- Apply filters ----------------
  const handleApply = () => {
    const filters = {};

    config.forEach((f) => {
      if (enabled[f.key] && values[f.key].trim() !== "") {
        filters[f.key] = values[f.key].trim();
      }
    });

    onApply(filters);
  };

  // ---------------- Clear filters ----------------
  const handleClear = () => {
    setEnabled(initialEnabled);
    setValues(initialValues);
    setActiveField(null);
    onApply({});
  };

  // ---------------- Hide suggestions if input cleared ----------------
  useEffect(() => {
    if (!activeQuery) setActiveField(null);
  }, [activeQuery]);

  return (
    <div className="mt-6 rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-sm ring-1 ring-slate-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Icon icon="mdi:filter-menu-outline" className="h-5 w-5 text-sky-500" />
        <h2 className="text-lg font-semibold text-slate-900">
          Apply Filters
        </h2>
      </div>

      <div className="space-y-4">
        {config.map((filter) => (
          <div key={filter.key} className="group relative">
            {/* Checkbox */}
            <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-all group-hover:shadow-sm">
              <input
                type="checkbox"
                name={filter.key}
                checked={enabled[filter.key]}
                onChange={handleToggle}
                className="
                  h-4 w-4 rounded
                  border border-slate-300
                  accent-sky-600
                  focus:ring-sky-500
                  cursor-pointer
                "
              />
              <span className="text-sm font-medium text-slate-900 group-hover:text-sky-600">
                {filter.label}
              </span>
            </label>

            {/* Input */}
            {enabled[filter.key] && (
              <div className="ml-8 mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 animate-in slide-in-from-top-2">
                <div className="relative">
                  {filter.icon && (
                    <Icon
                      icon={filter.icon}
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                    />
                  )}

                  <input
                    type={filter.type}
                    placeholder={filter.placeholder}
                    value={values[filter.key] || ''}
                    onChange={(e) => {
                      setValues((prev) => ({
                        ...prev,
                        [filter.key]: e.target.value,
                      }));

                      if (filter.typeahead) {
                        setActiveField(filter.key);
                      }
                    }}
                    className={`
                      w-full pr-4 py-2.5 text-sm
                      ${filter.icon ? "pl-10" : "pl-4"}
                      bg-white rounded-lg border border-slate-200
                      focus:outline-none focus:ring-2 focus:ring-sky-400
                      focus:border-sky-300
                      placeholder:text-slate-400
                      shadow-sm transition-all hover:border-slate-300
                    `}
                  />

                  {/* Typeahead suggestions */}
                  {filter.typeahead &&
                    activeField === filter.key &&
                    suggestions.length > 0 && (
                      <div className="absolute z-30 mt-2 w-full rounded-xl bg-white shadow-lg ring-1 ring-slate-200 overflow-hidden">
                        {suggestions.map((item,i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setValues((prev) => ({
                                ...prev,
                                [filter.key]: item.name,
                              }));
                              setActiveField(null);
                            }}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-slate-50"
                          >
                            {item.name}
                          </div>
                        ))}
                      </div>
                    )}

                  {loading &&
                    filter.typeahead &&
                    activeField === filter.key && (
                      <div className="absolute right-3 top-2 text-xs text-slate-400">
                        Loading...
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
        <button
          onClick={handleApply}
          className="
            flex-1 px-4 py-2.5 text-sm font-semibold text-white
            bg-gradient-to-r from-sky-500 to-sky-600
            hover:from-sky-600 hover:to-sky-700
            rounded-xl shadow-sm hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-sky-400
            focus:ring-offset-1 transition-all duration-200
          "
        >
          Apply Filters
        </button>

        <button
          onClick={handleClear}
          className="
            px-4 py-2.5 text-sm font-medium text-slate-700
            hover:text-slate-900 hover:bg-slate-100
            rounded-xl shadow-sm hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-slate-300
            focus:ring-offset-1 transition-all duration-200
          "
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default ApplyFilters;
