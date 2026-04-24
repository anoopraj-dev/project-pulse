import { Icon } from "@iconify/react";

const Section = ({ title, icon, children }) => (
  <section className="space-y-2 shadow-sm rounded-md p-3">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
        <Icon icon={icon} className="w-5 h-5 text-indigo-600" />
      </div>
      <h2 className="text-xl font-medium text-slate-900">{title}</h2>
    </div>
    {children}
  </section>
);

export default Section;
