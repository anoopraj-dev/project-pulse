import { Icon } from "@iconify/react";

const Titles = ({ field }) => {
  if (field.type !== "title") return null;

  const icons = {
    basicInfo: "mingcute:profile-fill",
    medicalInfo: "healthicons:blood-pressure-monitor-outline",
    lifeStyle: "mingcute:fork-knife-fill",
  };

  return (
    <div className="col-span-full w-full flex items-center gap-3 pb-3 mb-6 border-b border-sky-100">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-50">
        {icons[field.name] && (
          <Icon
            icon={icons[field.name]}
            className="text-xl text-sky-600"
          />
        )}
      </div>

      <h3 className="text-lg font-semibold text-sky-700 tracking-wide">
        {field.title}
      </h3>
    </div>
  );
};

export default Titles;
