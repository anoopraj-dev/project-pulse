const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = (page, totalPages) => {
    const delta = 2;
    const range = [];

    const start = Math.max(2, page - delta);
    const end = Math.min(totalPages - 1, page + delta);

    range.push(1);

    if (start > 2) range.push("...");

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (end < totalPages - 1) range.push("...");

    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-40"
      >
        Prev
      </button>

      <div className="flex items-center gap-1">
        {getPages(page, totalPages).map((p, i) =>
          p === "..." ? (
            <span key={i} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={i}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 text-xs rounded-lg transition ${
                p === page
                  ? "bg-[#0096C7] text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;