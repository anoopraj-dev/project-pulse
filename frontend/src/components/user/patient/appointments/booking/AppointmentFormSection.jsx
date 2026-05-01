const AppointmentFormSection = ({
  hasBookingInfo,
  activeDoctor,
  formData,
  handleChange,
  getAvailableDates,
  availableSlots,
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

      {/* Date & Time */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Date <span className="text-red-500">*</span>
          </label>

          {hasBookingInfo ? (
            <select
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full rounded-sm border border-slate-200 bg-white pl-4 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Select date</option>
              {getAvailableDates().map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={today}
              required
              className="w-full rounded-sm border border-slate-200 bg-white pl-4 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          )}
        </div>

        <div>
          <label
            htmlFor="time"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Time <span className="text-red-500">*</span>
          </label>

          {hasBookingInfo ? (
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              disabled={!formData.date}
              className="w-full rounded-sm border border-slate-200 bg-white pl-4 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Select time</option>
              {availableSlots().map((slot) => (
                <option key={slot.start} value={slot.start}>
                  {slot.start} - {slot.end}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full rounded-sm border border-slate-200 bg-white pl-4 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          )}
        </div>
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
