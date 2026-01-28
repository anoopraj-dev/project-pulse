const DataTable = ({
  data = [],
  columns = [],
  onView,
  emptyMessage = "No data available",
}) => {
  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
      <div className="overflow-auto max-h-[70vh]">
        <table className="min-w-full divide-y divide-gray-100">
          {/* ---------- HEADER ---------- */}
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-gray-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                SL.NO
              </th>

              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  {col.header}
                </th>
              ))}

              {onView && (
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
                  Action
                </th>
              )}
            </tr>
          </thead>

          {/* ---------- BODY ---------- */}
          <tbody className="divide-y divide-gray-50 bg-white">
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={row._id || index}
                  className={`transition-all ${
                    index % 2 === 0 ? "bg-slate-50/30" : ""
                  } hover:bg-gray-50/50`}
                >
                  <td className="px-6 py-5 text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>

                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-5 text-sm text-gray-600 ${
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {col.render(row, index)}
                    </td>
                  ))}

                  {onView && (
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => onView(row._id)}
                        className="text-blue-600 hover:text-blue-700 font-semibold hover:underline focus:outline-none"
                      >
                        View
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="px-6 py-10 text-center text-gray-500 font-medium"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
