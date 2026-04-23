
//-------------- DocCard -----------------------
import Thumbnail from "./Thumbnail";
import { Icon } from "@iconify/react";

const DocCard = ({ title, subtitle, meta, url, isImage, onView, onDownload, onDelete }) => (
  <div className="flex flex-col justify-between rounded-xl border border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:bg-slate-50 dark:hover:bg-gray-800/50 transition overflow-hidden">
    {/* Thumbnail area */}
    <div className="border-b border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 px-4 pt-4 pb-3">
      <Thumbnail
        url={url}
        isImage={isImage}
        onView={onView}
        onDownload={onDownload}
        onDelete={onDelete}
      />
    </div>

    {/* Info + actions */}
    <div className="p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{title}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>}
        {meta && (
          <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wide bg-slate-50 text-slate-500 border-slate-200 dark:bg-gray-800 dark:border-gray-700 dark:text-slate-400">
            <Icon icon="mdi:clock-outline" className="text-xs" />
            {meta}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-slate-200 dark:border-gray-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition"
        >
          <Icon icon="mdi:eye-outline" className="text-sm" />
          View
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-[#0096C7]/30 text-xs font-medium text-[#0096C7] hover:bg-[#0096C7]/5 transition"
        >
          <Icon icon="mdi:download-outline" className="text-sm" />
          Download
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center justify-center px-3 py-2 rounded-xl border border-red-100 text-xs font-medium text-red-500 hover:bg-red-50 transition"
          >
            <Icon icon="mdi:trash-can-outline" className="text-sm" />
          </button>
        )}
      </div>
    </div>
  </div>
);

export default DocCard;


