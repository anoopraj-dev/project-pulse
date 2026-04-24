
const DataTable = ({
  data = [],
  columns = [],
  onView,
  emptyMessage = "No data available",
}) => {
  return (
    <div className="w-full px-1 py-1">
      {data.length > 0 ? (
        <>
          {/* ------------- DESKTOP VIEW -------------*/}
          <div className="hidden lg:block overflow-auto max-h-[70vh]">
            <div className="flex flex-col gap-2 min-w-[600px]">
              
              {/* Column Labels */}
              <div
                className="grid items-center gap-4 px-4 pb-1"
                style={{
                  gridTemplateColumns: `2rem ${columns
                    .map(() => "1fr")
                    .join(" ")}${onView ? " 6rem" : ""}`,
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  #
                </span>

                {columns.map((col, i) => (
                  <span
                    key={i}
                    className={`text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 ${
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {col.header}
                  </span>
                ))}

                {onView && (
                  <span className="text-[10px] font-bold uppercase text-right text-slate-400 cursor-pointer">
                    Action
                  </span>
                )}
              </div>

              {/* Rows */}
              {data.map((row, index) => (
                <div
                  key={row._id || index}
                  className="bg-white rounded-xl border border-slate-100 hover:shadow-md"
                >
                  <div
                    className="grid items-center gap-4 px-4 py-3.5"
                    style={{
                      gridTemplateColumns: `2rem ${columns
                        .map(() => "1fr")
                        .join(" ")}${onView ? " 6rem" : ""}`,
                    }}
                  >
                    <span className="text-sm text-slate-400">
                      {index + 1}
                    </span>

                    {columns.map((col, colIndex) => (
                      <div
                        key={colIndex}
                        className={`text-sm text-slate-600 truncate ${
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                            ? "text-right"
                            : "text-left"
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
                            className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-500 rounded-lg cursor-pointer"
                          >
                            Retry
                          </button>
                        ) : (
                          <button
                            onClick={() => onView(row._id, "view")}
                            className="px-3 py-1.5 text-xs font-bold bg-slate-50 text-slate-600 rounded-lg cursor-pointer"
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
          </div>

          {/* ------------ MOBILE VIEW ----------------*/}
          <div className="lg:hidden flex flex-col gap-3">
            {data.map((row, index) => (
              <div
                key={row._id || index}
                className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm"
              >
                {/* Index */}
                <div className="text-xs text-slate-400 mb-2">
                  #{index + 1}
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-2">
                  {columns.map((col, colIndex) => (
                    <div key={colIndex} className="flex justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-400">
                        {col.header}
                      </span>
                      <span className="text-sm text-slate-700 text-right">
                        {col.render(row, index)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action */}
                {onView && (
                  <div className="mt-3 flex justify-end">
                    {row.status === "failed" ? (
                      <button
                        onClick={() => onView(row._id, "retry")}
                        className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-500 rounded-lg cursor-pointer"
                      >
                        Retry
                      </button>
                    ) : (
                      <button
                        onClick={() => onView(row._id, "view")}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-700 rounded-lg cursor-pointer"
                      >
                        View
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="py-16 flex flex-col items-center gap-3">
          <p className="text-sm text-slate-400 font-medium">
            {emptyMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default DataTable;