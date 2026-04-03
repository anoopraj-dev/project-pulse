// import React from "react";
// import { formatLabel } from "../../../utilis/formLabelFormat";
// import { DetailsDisplayCard } from "./BasicInfoCard";

// const isPlainObject = (val) =>
//   typeof val === "object" && val !== null && !Array.isArray(val);

// /* ---------- IGNORE FILE FIELDS ---------- */
// const IGNORED_KEYS = [
//   "educationCertificate",
//   "experienceCertificate",
//   "proofDocument",
// ];

// const ignoreKey = (key) =>
//   IGNORED_KEYS.some((ignored) =>
//     key.toLowerCase().includes(ignored.toLowerCase())
//   );

// /* ---------- MAIN COMPONENT ---------- */
// const DynamicInfoSection = ({ data, title = "Information" }) => {
//   const isEmpty =
//     data == null ||
//     (Array.isArray(data) && data.length === 0) ||
//     (isPlainObject(data) && Object.keys(data).length === 0);

//   if (isEmpty) {
//     return (
//       <div className="py-8 text-center">
//         <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 mb-3">
//           <svg
//             className="w-6 h-6 text-gray-400"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
//             />
//           </svg>
//         </div>
//         <p className="text-gray-500 text-sm">
//           No {title.toLowerCase()} available
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-5">
//       {/* Section Header */}
//       <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
//         <div className="w-1 h-5 bg-[#0096C7] rounded-full" />
//         <h3 className="text-base font-bold text-gray-900">{title}</h3>
//       </div>

//       {/* Data Content */}
//       <DataGrid data={data} />
//     </div>
//   );
// };

// /* ---------- DATA GRID ---------- */
// const DataGrid = ({ data }) => {
//   if (typeof data === "string" || typeof data === "number") {
//     return <DetailsDisplayCard label="Value" value={data} />;
//   }

//   /* -------- OBJECT -------- */
//   if (isPlainObject(data)) {
//     const entries = Object.entries(data).filter(
//       ([key, value]) =>
//         !key.match(/^(id|_id|Id|ID)$/i) &&
//         !ignoreKey(key) &&
//         value != null &&
//         value !== ""
//     );

//     return (
//       <div
//         className={`grid gap-x-6 gap-y-4 ${
//           entries.length === 1
//             ? "grid-cols-1"
//             : "grid-cols-1 md:grid-cols-2"
//         }`}
//       >
//         {entries.map(([key, value]) => (
//           <DetailsDisplayCard
//             key={key}
//             label={formatLabel(key)}
//             value={value}
//           />
//         ))}
//       </div>
//     );
//   }

//   /* -------- ARRAY -------- */
//   if (Array.isArray(data)) {
//     return (
//       <div className="space-y-6">
//         {data
//           .filter((item) => item != null)
//           .map((item, index) => (
//             <div key={index} className="relative">
//               {/* Item Divider */}
//               {index > 0 && (
//                 <div className="mb-6 -mt-2">
//                   <div className="h-px bg-gray-200" />
//                 </div>
//               )}

//               {/* Item Number Indicator */}
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0096C7] text-white text-xs font-bold">
//                   {index + 1}
//                 </div>
//                 <div className="flex-1 h-px bg-gray-200" />
//               </div>

//               {/* Item Content */}
//               {typeof item === "string" || typeof item === "number" ? (
//                 <div className="pl-10">
//                   <DetailsDisplayCard value={item} />
//                 </div>
//               ) : isPlainObject(item) ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pl-10">
//                   {Object.entries(item)
//                     .filter(
//                       ([key, value]) =>
//                         !key.match(/^(id|_id|Id|ID)$/i) &&
//                         !ignoreKey(key) &&
//                         value != null &&
//                         value !== ""
//                     )
//                     .map(([key, value]) => (
//                       <DetailsDisplayCard
//                         key={key}
//                         label={formatLabel(key)}
//                         value={value}
//                       />
//                     ))}
//                 </div>
//               ) : null}
//             </div>
//           ))}
//       </div>
//     );
//   }

//   return null;
// };

// export default DynamicInfoSection;

import React from "react";
import { formatLabel } from "../../../utilis/formLabelFormat";
import { Icon } from "@iconify/react";

const isPlainObject = (val) =>
  typeof val === "object" && val !== null && !Array.isArray(val);

const IGNORED_KEYS = [
  "educationCertificate",
  "experienceCertificate",
  "proofDocument",
];

const ignoreKey = (key) =>
  IGNORED_KEYS.some((ignored) =>
    key.toLowerCase().includes(ignored.toLowerCase())
  );

/* ---------- pick a human-readable "title" from an entry object ---------- */
const TITLE_PRIORITY = [
  "institutionName", "institution", "schoolName", "universityName",
  "hospital", "hospitalName", "clinicName", "organizationName", "company",
  "employer", "workplace", "degree", "qualification", "position",
  "role", "jobTitle", "title", "name",
];

const getEntryTitle = (obj) => {
  for (const key of TITLE_PRIORITY) {
    if (obj[key] && typeof obj[key] === "string") return obj[key];
  }
  // fallback: first non-ignored string value
  for (const [, val] of Object.entries(obj)) {
    if (typeof val === "string" && val.trim()) return val;
  }
  return null;
};

/* pick a secondary line (e.g. degree, years) */
const SUBTITLE_PRIORITY = [
  "degree", "qualification", "specialization", "position", "role",
  "jobTitle", "department", "field", "course",
];

const getEntrySubtitle = (obj, usedKey) => {
  for (const key of SUBTITLE_PRIORITY) {
    if (obj[key] && typeof obj[key] === "string" && obj[key] !== usedKey)
      return obj[key];
  }
  return null;
};

/* pick a date/year range */
const DATE_KEYS = ["startYear", "endYear", "year", "from", "to", "duration", "period", "startDate", "endDate"];
const getEntryDates = (obj) => {
  const parts = [];
  for (const key of DATE_KEYS) {
    if (obj[key]) parts.push(String(obj[key]));
    if (parts.length === 2) break;
  }
  return parts.join(" – ") || null;
};

/* ---------- FIELD ROW ---------- */
const FieldRow = ({ label, value }) => {
  if (value == null || value === "") return null;
  const display = Array.isArray(value) ? value.join(", ") : String(value);

  return (
    <div className="flex items-start gap-3 px-4 py-2.5 border-b border-gray-50 dark:border-gray-800/60 last:border-0">
      <span className="mt-0.5 inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap flex-shrink-0">
        {label}
      </span>
      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 break-words leading-relaxed pt-0.5">
        {display}
      </p>
    </div>
  );
};

/* ---------- ITEM CARD — each education/experience/etc entry ---------- */
const ItemCard = ({ item }) => {
  if (typeof item === "string" || typeof item === "number") {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <FieldRow label="Value" value={item} />
      </div>
    );
  }

  if (!isPlainObject(item)) return null;

  const titleVal = getEntryTitle(item);
  const subtitleVal = getEntrySubtitle(item, titleVal);
  const dateRange = getEntryDates(item);

  // keys to render as field rows (skip the ones used in the header)
  const headerKeys = new Set(
    [...TITLE_PRIORITY, ...SUBTITLE_PRIORITY, ...DATE_KEYS].map((k) => k.toLowerCase())
  );

  const remainingEntries = Object.entries(item).filter(([key, value]) => {
    if (key.match(/^(id|_id|Id|ID)$/i)) return false;
    if (ignoreKey(key)) return false;
    if (value == null || value === "") return false;
    // keep if it wasn't used as the title/subtitle/date
    const kl = key.toLowerCase();
    if (titleVal && String(item[key]) === titleVal) return false;
    if (subtitleVal && String(item[key]) === subtitleVal) return false;
    return true;
  });

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Card header band */}
      {(titleVal || dateRange) && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {titleVal && (
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-snug truncate">
                  {titleVal}
                </p>
              )}
              {subtitleVal && (
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                  {subtitleVal}
                </p>
              )}
            </div>
            {dateRange && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                <Icon icon="mdi:calendar-outline" className="w-3 h-3" />
                {dateRange}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Field rows for remaining keys */}
      <div>
        {remainingEntries.map(([key, value]) => (
          <FieldRow key={key} label={formatLabel(key)} value={value} />
        ))}
      </div>
    </div>
  );
};

/* ---------- DATA GRID ---------- */
const DataGrid = ({ data }) => {
  if (typeof data === "string" || typeof data === "number") {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <FieldRow label="Value" value={data} />
      </div>
    );
  }

  if (isPlainObject(data)) {
    const entries = Object.entries(data).filter(
      ([key, value]) =>
        !key.match(/^(id|_id|Id|ID)$/i) &&
        !ignoreKey(key) &&
        value != null &&
        value !== ""
    );
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {entries.map(([key, value]) => (
          <FieldRow key={key} label={formatLabel(key)} value={value} />
        ))}
      </div>
    );
  }

  if (Array.isArray(data)) {
    const filtered = data.filter((item) => item != null);
    return (
      <div className="space-y-3">
        {filtered.map((item, index) => (
          <ItemCard key={index} item={item} />
        ))}
      </div>
    );
  }

  return null;
};

/* ---------- MAIN COMPONENT ---------- */
const DynamicInfoSection = ({ data, title = "Information" }) => {
  const isEmpty =
    data == null ||
    (Array.isArray(data) && data.length === 0) ||
    (isPlainObject(data) && Object.keys(data).length === 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">

      {/* Card header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
          <Icon icon="mdi:text-box-check-outline" className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
            {title}
          </h2>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
            Professional details
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <Icon icon="mdi:inbox-outline" className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              No {title.toLowerCase()} available
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Nothing has been added yet
            </p>
          </div>
        ) : (
          <DataGrid data={data} />
        )}
      </div>
    </div>
  );
};

export default DynamicInfoSection;