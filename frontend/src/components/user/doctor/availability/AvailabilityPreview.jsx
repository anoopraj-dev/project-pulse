const AvailabilityPreview = ({ availability = [], loading = false }) => {
  return (
    <div className="mt-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Availability
        </h2>

        {loading ? (
          <div className="space-y-4">
            <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-52 bg-slate-200 rounded animate-pulse" />
          </div>
        ) : availability.length === 0 ? (
          <p className="text-slate-500 text-sm">No availability scheduled.</p>
        ) : (
          <div className="space-y-5">
            {availability.map((day) => {
              // Filter out booked slots
              const availableSlots = day.slots.filter((slot) => !slot.isBooked);

              if (availableSlots.length === 0) return null; // skip days with no available slots

              return (
                <div
                  key={day.date}
                  className="border border-slate-200 rounded-2xl p-5"
                >
                  <p className="font-medium text-slate-700 mb-3">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map((slot, index) => (
                      <span
                        key={index}
                        className="bg-sky-100 text-sky-700 px-4 py-1.5 rounded-full text-sm font-medium"
                      >
                        {slot.startTime} - {slot.endTime}
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
