// AppointmentAvailabilityPicker.jsx

import { Icon } from "@iconify/react";

const AppointmentAvailabilityPicker = ({
  availability = [],
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}) => {
  const today = new Date();

  // Filter future dates only
  const validAvailability = availability
    .map((day) => {
      const filteredSlots =
        day.slots?.filter((slot) => {
          if (slot.isBooked) return false;

          const slotStart = new Date(slot.startAt);

          return slotStart > today;
        }) || [];

      return {
        ...day,
        slots: filteredSlots,
      };
    })
    .filter((day) => day.slots.length > 0);

  if (validAvailability.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
          <Icon
            icon="mdi:calendar-remove-outline"
            className="w-6 h-6 text-gray-400"
          />
        </div>

        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          No available slots
        </p>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Please check another doctor or date
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {validAvailability.map((day) => {
        const dateObj = new Date(day.date + "T00:00:00");

        const weekday = dateObj.toLocaleDateString("en-US", {
          weekday: "short",
        });

        const formatted = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        const isSelectedDate = selectedDate === day.date;

        return (
          <div
            key={day.date}
            className={`rounded-2xl border transition-all overflow-hidden ${
              isSelectedDate
                ? "border-blue-500 dark:border-blue-500"
                : "border-gray-200 dark:border-gray-800"
            }`}
          >
            {/* Date Header */}
            <button
              type="button"
              onClick={() => onSelectDate(day.date)}
              className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${
                isSelectedDate
                  ? "bg-blue-50 dark:bg-blue-950/40"
                  : "bg-gray-50 dark:bg-gray-800/40"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon="mdi:calendar-outline"
                  className="w-4 h-4 text-gray-500"
                />

                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {weekday}
                </span>

                <span className="text-xs text-gray-500">
                  {formatted}
                </span>
              </div>

              <span className="text-[11px] px-2 py-1 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500">
                {day.slots.length} slot
                {day.slots.length > 1 ? "s" : ""}
              </span>
            </button>

            {/* Slots */}
            {isSelectedDate && (
              <div className="p-4 flex flex-wrap gap-2">
                {day.slots.map((slot, index) => {
                  const slotValue =
                    slot.startTime || slot.start;

                  const isSelected =
                    selectedTime === slotValue;

                  return (
                    <button
                      type="button"
                      key={index}
                      onClick={() => onSelectTime(slotValue)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/60"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Icon
                          icon="mdi:clock-outline"
                          className="w-3 h-3"
                        />

                        {slot.startTime ?? slot.start} –{" "}
                        {slot.endTime ?? slot.end}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentAvailabilityPicker;