import { Icon } from "@iconify/react";
import ActionButton from "./ActionButton";

const Thumbnail = ({
  url,
  isImage,
  onView,
  onDownload,
  onDelete,
  small,
  deletable = true,
}) => (
  <div
    className={`relative rounded-lg overflow-hidden border border-slate-200 ${
      small ? "w-24 h-24" : "w-full h-32"
    }`}
  >
    {isImage(url) ? (
      <img
        src={url}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
        <Icon
          icon="mdi:file-pdf-box"
          className={small ? "w-6 h-6 text-red-400" : "w-8 h-8 text-red-400"}
        />
      </div>
    )}

    <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 hover:opacity-100 transition-opacity bg-black/0 hover:bg-black/10">
      <ActionButton icon="mdi:eye" onClick={onView} />
      <ActionButton icon="mdi:download" onClick={onDownload} />
      {deletable && (
        <ActionButton icon="mdi:delete" onClick={onDelete} danger />
      )}
    </div>
  </div>
);

export default Thumbnail;
