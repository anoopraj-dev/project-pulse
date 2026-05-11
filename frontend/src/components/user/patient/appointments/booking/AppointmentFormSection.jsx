const AppointmentFormSection = ({
  hasBookingInfo,
  activeDoctor,
  formData,
  setFormData,
  handleChange,
  today,
}) => {
 

  return (
    <form className="space-y-6">
      {/* Specialty */}
      <div>
        <label
          htmlFor="specialty"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Specialty <span className="text-red-500">*</span>
        </label>

        {hasBookingInfo ? (
          <input
            type="text"
            value={formData.specialty}
            disabled
            className="w-full rounded-sm border border-slate-200 bg-slate-50 pl-4 pr-4 py-2.5 text-sm text-slate-900"
          />
        ) : (
          <input
            type="text"
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            required
            className="w-full rounded-sm border border-slate-200 bg-white pl-4 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        )}
      </div>

      {/* Doctor */}
      <div>
        <label
          htmlFor="doctorId"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Doctor <span className="text-red-500">*</span>
        </label>

        {hasBookingInfo ? (
          <input
            type="text"
            value={activeDoctor?.doctorName}
            disabled
            className="w-full rounded-sm border border-slate-200 bg-slate-50 pl-4 pr-4 py-2.5 text-sm text-slate-900"
          />
        ) : (
          <input
            type="text"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
            className="w-full rounded-sm border border-slate-200 bg-white pl-4 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        )}
      </div>

      {/* Service Type */}
      <div>
        <label
          htmlFor="serviceType"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Service Type <span className="text-red-500">*</span>
        </label>

        {hasBookingInfo ? (
          <select
            id="serviceType"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
            className="w-full rounded-sm border border-slate-200 bg-white pl-4 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Select service</option>
            {activeDoctor?.services?.map((service) => (
              <option key={service.serviceType} value={service.serviceType}>
                {service.serviceType} - ₹{service.fees}
              </option>
            ))}
          </select>
        ) : (
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
            className="w-full rounded-sm border border-slate-200 bg-white pl-4 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Select service</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        )}
      </div>
        {/* Availability Picker */}
<div>
  <label className="block text-sm font-medium text-slate-700 mb-3">
    Select Appointment Slot <span className="text-red-500">*</span>
  </label>

  {hasBookingInfo ? (
    <div className="space-y-4">
      {activeDoctor?.availability?.some((day) =>
  day.slots?.some((slot) => {
    if (slot.isBooked) return false;

    return new Date(slot.startAt) > new Date();
  })
) ? (
        activeDoctor.availability
  .filter((day) => {
    const now = new Date();

    const availableSlots =
      day.slots?.filter((slot) => {
        if (slot.isBooked) return false;

        const slotStart = new Date(slot.startAt);

        return slotStart > now;
      }) || [];

    return availableSlots.length > 0;
  })
  .map((day) => {
        const now = new Date();

          const availableDaySlots =
            day.slots?.filter((slot) => {
              if (slot.isBooked) return false;

              const slotStart = new Date(slot.startAt);

              return slotStart > now;
            }) || [];

          const dateObj = new Date(day.date + "T00:00:00");

          const weekday = dateObj.toLocaleDateString("en-US", {
            weekday: "long",
          });

          const formattedDate = dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          const isSelectedDate = formData.date === day.date;

          return (
            <div
              key={day.date}
              className={`rounded-2xl border overflow-hidden transition-all ${
                isSelectedDate
                  ? "border-indigo-500"
                  : "border-slate-200"
              }`}
            >
              {/* Date Header */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    date: day.date,
                    time: "",
                  }))
                }
                className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${
                  isSelectedDate
                    ? "bg-indigo-50"
                    : "bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">
                    {weekday}
                  </span>

                  <span className="text-xs text-slate-500">
                    {formattedDate}
                  </span>
                </div>

                <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-500">
                  {availableDaySlots.length} slot
                  {availableDaySlots.length !== 1 ? "s" : ""}
                </span>
              </button>

              {/* Slots */}
              {isSelectedDate && (
                <div className="p-4 border-t border-slate-100">
                  {availableDaySlots.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {availableDaySlots.map((slot) => {
                        const start = new Date(slot.startAt);
                        const end = new Date(slot.endAt);

                        const startTime = start.toTimeString().slice(0, 5);

                        const displayTime = `${start.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} - ${end.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`;

                        const isSelectedTime =
                          formData.time === startTime;

                        return (
                          <button
                            key={slot.startAt}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                time: startTime,
                              }))
                            }
                            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                              isSelectedTime
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100"
                            }`}
                          >
                            {displayTime}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-sm font-medium text-slate-500">
                        No available slots
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Please choose another date
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
          <p className="text-sm font-semibold text-slate-600">
            No availability scheduled
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Please check again later
          </p>
        </div>
      )}
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* Manual Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Date <span className="text-red-500">*</span>
        </label>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={today}
          required
          className="w-full rounded-sm border border-slate-200 bg-white pl-4 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Manual Time */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Time <span className="text-red-500">*</span>
        </label>

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          className="w-full rounded-sm border border-slate-200 bg-white pl-4 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>
    </div>
  )}
</div>

      {/* Reason */}
      <div>
        <label
          htmlFor="reason"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Reason for Visit <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
          placeholder="e.g., Regular checkup, Follow-up consultation"
          className="w-full rounded-sm border border-slate-200 bg-white pl-4 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Additional Notes <span className="text-slate-400">(Optional)</span>
        </label>

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Any specific concerns or symptoms you'd like to discuss..."
          className="w-full rounded-sm border border-slate-200 bg-white pl-4 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
        />
      </div>
    </form>
  );
};

export default AppointmentFormSection;
