
const DataTable = ({
  data = [],
  columns = [],
  onView,
  emptyMessage = "No data available",
}) => {
  return (
    <div className="w-full overflow-auto max-h-[70vh] px-1 py-1">
      {data.length > 0 ? (
        <div className="flex flex-col gap-2">
          {/*-------------Column labels  ----------*/}
          <div
            className="grid items-center gap-4 px-4 pb-1"
            style={{
              gridTemplateColumns: `2rem ${columns.map(() => "1fr").join(" ")}${onView ? " 6rem" : ""}`,
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">#</span>
            {columns.map((col, i) => (
              <span
                key={i}
                className={`text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 ${
                  col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.header}
              </span>
            ))}
            {onView && (
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 text-right">
                Action
              </span>
            )}
          </div>

          {/* -------------- Cards -------------- */}
          {data.map((row, index) => (
            <div
              key={row._id || index}
              className="group bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md shadow-sm transition-all duration-200"
            >
              <div
                className="grid items-center gap-4 px-4 py-3.5"
                style={{
                  gridTemplateColumns: `2rem ${columns.map(() => "1fr").join(" ")}${onView ? " 6rem" : ""}`,
                }}
              >
                {/* number */}
                <span className="text-sm font-medium text-slate-400 tabular-nums">
                  {index + 1}
                </span>

                {columns.map((col, colIndex) => (
                  <div
                    key={colIndex}
                    className={`text-sm text-slate-600 truncate ${
                      col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {col.render(row, index)}
                  </div>
                ))}

                {onView && (
                  <div className="flex justify-end">
                    {row.status === "failed" ? (
                      <button
                        onClick={() => onView(row._id, "retry")}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-150"
                      >
                         Retry
                      </button>
                    ) : (
                      <button
                        onClick={() => onView(row._id, "view")}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all duration-150"
                      >
                        View 
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
            </svg>
          </div>
          <p className="text-sm text-slate-400 font-medium">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;