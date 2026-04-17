
import { Icon } from "@iconify/react";

const AvailabilityPreview = ({ availability = [], loading = false }) => {
  console.log(availability)
  const hasData = availability.some(
    (day) => day.slots?.some((s) => !s.isBooked)
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
            <Icon icon="mdi:calendar-clock" className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
              Availability
            </h2>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              Open slots for booking
            </p>
          </div>
        </div>

        {!loading && hasData && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 uppercase tracking-wide">
            Available
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-3">
                <div className="h-3.5 w-36 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                <div className="flex gap-2 flex-wrap">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-7 w-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <Icon icon="mdi:calendar-remove-outline" className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              No availability scheduled
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Check back later for open slots
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {availability.map((day) => {
              const availableSlots = day.slots?.filter((s) => !s.isBooked) ?? [];
              if (availableSlots.length === 0) return null;

              const dateObj = new Date(day.date + "T00:00:00");
              const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });
              const formatted = dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              const isToday =
                new Date().toISOString().split("T")[0] === day.date;
                

              return (
                <div
                  key={day.date}
                  className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                  {/* Day row */}
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="mdi:calendar-outline"
                        className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"
                      />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {weekday}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">
                        · {formatted}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isToday && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white uppercase tracking-wide">
                          Today
                        </span>
                      )}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                        {availableSlots.length} slot{availableSlots.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Slots */}
                  <div className="px-4 py-3 flex flex-wrap gap-2">
                    {availableSlots.map((slot, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900"
                      >
                        <Icon icon="mdi:clock-outline" className="w-3 h-3 opacity-70" />
                        {slot.startTime ?? slot.start} – {slot.endTime ?? slot.end}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityPreview;
