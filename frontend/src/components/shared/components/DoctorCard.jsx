import { Icon } from "@iconify/react";

const DoctorCard = ({ doctor, onView }) => {
  const { _id, name, professionalInfo, profilePicture, rating, services } =
    doctor || {};

  const primarySpecialization =
    professionalInfo?.specializations?.[0] || "General Physician";

  return (
    <div
      className="
        group relative flex flex-col
        w-full max-w-[280px]
        overflow-hidden
        rounded-2xl
        border border-slate-100
        bg-white
        shadow-sm hover:shadow-md hover:-translate-y-[1px]
        transition-all duration-200
      "
    >
      {/* Image + gradient overlay */}
      <div className="relative h-40 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-cyan-50 to-white" />
        {profilePicture && (
          <img
            src={profilePicture}
            alt={name}
            className="relative h-full w-full object-cover"
          />
        )}

        {/* Soft bottom gradient to make text readable if you add it later */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

        {/* Rating pill */}
        {rating != null && (
          <div
            className="
              absolute top-3 right-3
              flex items-center gap-1
              rounded-full bg-white/90
              px-2.5 py-1
              text-[11px] font-medium text-slate-800
              shadow-sm
              backdrop-blur
            "
          >
            <Icon
              icon="mingcute:star-fill"
              className="h-3.5 w-3.5 text-amber-400"
            />
            <span>{rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name + specialization */}
        <div className="flex gap-8">
          <h3 className="truncate text-base font-semibold text-slate-900">
            Dr. {name}
          </h3>

          <div className="flex items-center gap-2">
            <span
              className="
                inline-flex items-center gap-1
                rounded-full bg-slate-100
                px-2.5 py-1
                text-[11px] font-medium text-slate-700
              "
            >
              <Icon
                icon="mdi:stethoscope"
                className="h-3.5 w-3.5 text-slate-500"
              />
              {primarySpecialization}
            </span>
          </div>
        </div>

        {/* All specializations (compact line) */}
        {professionalInfo?.specializations?.length > 1 && (
          <p className="mt-2 line-clamp-1 text-[11px] text-slate-500">
            {professionalInfo.specializations.join(" • ")}
          </p>
        )}

        {/* Services & fees */}
        {services?.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {services.map((service) => (
              <div
                key={service._id}
                className="flex items-center justify-between text-xs"
              >
                <span className="capitalize text-slate-500">
                  {service.serviceType} consultation
                </span>
                <span className="font-semibold text-slate-900">
                  ₹ {service.fees}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="mt-4 h-px bg-slate-100" />

        {/* CTA */}
        <button
          onClick={() => onView?.(_id)}
          className="
            mt-3 flex w-full items-center justify-center gap-2
            rounded-xl
            bg-gradient-to-r from-sky-600 to-cyan-500
            py-2.5
            text-sm font-medium text-white
            shadow-sm
            hover:from-sky-700 hover:to-cyan-600
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-sky-500 focus-visible:ring-offset-2
            transition-all duration-200
            group-hover:translate-y-[1px]
          "
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
