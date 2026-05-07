// import { useState } from "react";

// const AvailabilityList = ({ availability = [], limitDays = 3 }) => {
//   const [showAll, setShowAll] = useState(false);

//   const visibleData = showAll ? availability : availability.slice(0, limitDays);

//   return (
//     <div className="space-y-3">
//       {visibleData.map((day) => {
//         const availableSlots = day.slots?.filter((s) => !s.isBooked) ?? [];
//         if (availableSlots.length === 0) return null;

//         const dateObj = new Date(day.date + "T00:00:00");
//         const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });
//         const formatted = dateObj.toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//         });

//         const isToday =
//           new Date().toISOString().split("T")[0] === day.date;

//         return (
//           <div
//             key={day.date}
//             className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
//           >
//             {/* Day */}
//             <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
//               <div className="flex items-center gap-2">
//                 <Icon icon="mdi:calendar-outline" className="w-3.5 h-3.5 text-gray-400" />
//                 <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
//                   {weekday}
//                 </span>
//                 <span className="text-[11px] text-gray-400">
//                   · {formatted}
//                 </span>
//               </div>

//               <div className="flex items-center gap-1.5">
//                 {isToday && (
//                   <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
//                     Today
//                   </span>
//                 )}
//                 <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-gray-900 border">
//                   {availableSlots.length} slots
//                 </span>
//               </div>
//             </div>

//             {/* Slots */}
//             <div className="px-4 py-3 flex flex-wrap gap-2">
//               {availableSlots.map((slot, index) => (
//                 <span
//                   key={index}
//                   className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 border"
//                 >
//                   <Icon icon="mdi:clock-outline" className="w-3 h-3 opacity-70" />
//                   {slot.startTime ?? slot.start} – {slot.endTime ?? slot.end}
//                 </span>
//               ))}
//             </div>
//           </div>
//         );
//       })}

//       {/* View more */}
//       {availability.length > limitDays && (
//         <button
//           onClick={() => setShowAll((prev) => !prev)}
//           className="text-xs text-blue-600 font-semibold"
//         >
//           {showAll ? "View less" : "View more"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default AvailabilityList

import { useState } from "react";
import { Icon } from "@iconify/react";

const AvailabilityList = ({ availability = [], limitDays = 3 }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleData = showAll ? availability : availability.slice(0, limitDays);

  const formatTime = (iso) => {
    if (!iso) return "--";
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = (endTime, isBooked) => {
    if (isBooked) return false;
    if (!endTime) return true;

    const slotTime = new Date(endTime);
    if (isNaN(slotTime)) return true;

    return slotTime < new Date();
  };

  return (
    <div className="space-y-4">
      {visibleData.map((day) => {
        if (!day.slots || day.slots.length === 0) return null;

        const dateObj = new Date(day.date);

        const weekday = dateObj.toLocaleDateString("en-US", {
          weekday: "long",
        });

        const formatted = dateObj.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });

        const todayStr = new Date().toISOString().split("T")[0];
        const isToday = todayStr === day.date;

        return (
          <div
            key={day.date}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            {/* HEADER */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                  <Icon
                    icon="mdi:calendar-outline"
                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                    {weekday}
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {formatted}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isToday && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    Today
                  </span>
                )}
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                  {day.slots.length} slots
                </span>
              </div>
            </div>

            {/* SLOTS GRID */}
            <div className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {day.slots.map((slot, index) => {
                  const expired = isExpired(slot.endTime, slot.isBooked);

                  return (
                    <div
                      key={index}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-semibold text-center transition-all
                        ${
                          slot.isBooked
                            ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-500"
                            : expired
                            ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400 line-through"
                            : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700"
                        }`}
                    >
                      <span className="block leading-none">
                        {formatTime(slot.startTime)}
                      </span>

                      <span className="block text-[9px] mt-0.5 font-normal">
                        {slot.isBooked
                          ? "Booked"
                          : expired
                          ? "Expired"
                          : `→ ${formatTime(slot.endTime)}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* VIEW MORE */}
      {availability.length > limitDays && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="text-xs text-blue-600 font-semibold"
        >
          {showAll ? "View less" : "View more"}
        </button>
      )}
    </div>
  );
};

export default AvailabilityList;