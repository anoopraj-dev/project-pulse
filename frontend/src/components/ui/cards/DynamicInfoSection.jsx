import React from "react";
import { formatLabel } from "../../../utilis/formLabelFormat";
import { DetailsDisplayCard } from "./BasicInfoCard";

const isPlainObject = (val) =>
  typeof val === "object" && val !== null && !Array.isArray(val);

/* ---------- IGNORE FILE FIELDS ---------- */
const IGNORED_KEYS = [
  "educationCertificate",
  "experienceCertificate",
  "proofDocument",
];

const ignoreKey = (key) =>
  IGNORED_KEYS.some((ignored) =>
    key.toLowerCase().includes(ignored.toLowerCase())
  );

/* ---------- MAIN COMPONENT ---------- */
const DynamicInfoSection = ({ data, title = "Information" }) => {
  const isEmpty =
    data == null ||
    (Array.isArray(data) && data.length === 0) ||
    (isPlainObject(data) && Object.keys(data).length === 0);

  if (isEmpty) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 mb-3">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">
          No {title.toLowerCase()} available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
        <div className="w-1 h-5 bg-[#0096C7] rounded-full" />
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
      </div>

      {/* Data Content */}
      <DataGrid data={data} />
    </div>
  );
};

/* ---------- DATA GRID ---------- */
const DataGrid = ({ data }) => {
  if (typeof data === "string" || typeof data === "number") {
    return <DetailsDisplayCard label="Value" value={data} />;
  }

  /* -------- OBJECT -------- */
  if (isPlainObject(data)) {
    const entries = Object.entries(data).filter(
      ([key, value]) =>
        !key.match(/^(id|_id|Id|ID)$/i) &&
        !ignoreKey(key) &&
        value != null &&
        value !== ""
    );

    return (
      <div
        className={`grid gap-x-6 gap-y-4 ${
          entries.length === 1
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {entries.map(([key, value]) => (
          <DetailsDisplayCard
            key={key}
            label={formatLabel(key)}
            value={value}
          />
        ))}
      </div>
    );
  }

  /* -------- ARRAY -------- */
  if (Array.isArray(data)) {
    return (
      <div className="space-y-6">
        {data
          .filter((item) => item != null)
          .map((item, index) => (
            <div key={index} className="relative">
              {/* Item Divider */}
              {index > 0 && (
                <div className="mb-6 -mt-2">
                  <div className="h-px bg-gray-200" />
                </div>
              )}

              {/* Item Number Indicator */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0096C7] text-white text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Item Content */}
              {typeof item === "string" || typeof item === "number" ? (
                <div className="pl-10">
                  <DetailsDisplayCard value={item} />
                </div>
              ) : isPlainObject(item) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pl-10">
                  {Object.entries(item)
                    .filter(
                      ([key, value]) =>
                        !key.match(/^(id|_id|Id|ID)$/i) &&
                        !ignoreKey(key) &&
                        value != null &&
                        value !== ""
                    )
                    .map(([key, value]) => (
                      <DetailsDisplayCard
                        key={key}
                        label={formatLabel(key)}
                        value={value}
                      />
                    ))}
                </div>
              ) : null}
            </div>
          ))}
      </div>
    );
  }

  return null;
};

export default DynamicInfoSection;