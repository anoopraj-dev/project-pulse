import Thumbnail from "./Thumbnail";

const DocCard = ({ title, subtitle, meta, url, isImage, onView, onDownload, onDelete }) => (
  <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow">
    <Thumbnail url={url} isImage={isImage} onView={onView} onDownload={onDownload} onDelete={onDelete} />
    <div>
      <p className="text-lg font-medium text-slate-900">{title}</p>
      <p className="text-sm text-slate-500">{subtitle}</p>
      <p className="text-sm text-slate-400">{meta}</p>
    </div>
  </div>
);

export default DocCard;
