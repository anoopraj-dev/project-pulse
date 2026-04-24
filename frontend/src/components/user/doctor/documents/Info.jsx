const Info = ({ label, value }) => (
  <div className="px-3 py-1">
    <p className="text-xs font-medium text-slate-500 uppercase">{label}</p>
    <p className="text-md font-medium text-slate-900 uppercase">{value || "—"}</p>
  </div>
);

export default Info;
