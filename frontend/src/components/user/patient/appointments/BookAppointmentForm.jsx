import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { bookAppointment } from "@/api/patient/patientApis";

const BookAppointmentForm = ({ onSuccess, bookingInfo, setActiveTab }) => {
  const [formData, setFormData] = useState({
    doctorId: "",
    specialty: "",
    serviceType: "",
    date: "",
    time: "",
    reason: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasBookingInfo = !!bookingInfo?.doctorId;

  // Prefill when bookingInfo exists
  useEffect(() => {
    if (!bookingInfo?.doctorId) return;

    setFormData((prev) => ({
      ...prev,
      doctorId: bookingInfo.doctorId,
      specialty: bookingInfo.specialty || "",
    }));
  }, [bookingInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "date" ? { time: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await bookAppointment(formData);

      if (!response.data.success)
        return toast.error("Failed to book appointment");

      toast.success("Appointment booked successfully!");
      setActiveTab("upcoming");

      setFormData({
        doctorId: "",
        specialty: "",
        serviceType: "",
        date: "",
        time: "",
        reason: "",
        notes: "",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to book appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSlots = () => {
    if (!hasBookingInfo || !formData.date) return [];

    const day = bookingInfo.availability?.find(
      (d) => d.date.split("T")[0] === formData.date,
    );

    return day?.slots || [];
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-200">
            <Icon
              icon="mdi:calendar-plus"
              className="text-2xl text-indigo-600"
            />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            Book New Appointment
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Fill in the details below to schedule your appointment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                value={bookingInfo.doctorName}
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
                {bookingInfo.services?.map((service) => (
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
                  {bookingInfo.availability?.map((day) => (
                    <option key={day.date} value={day.date.split("T")[0]}>
                      {day.date.split("T")[0]}
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
                    <option key={slot.startTime} value={slot.startTime}>
                      {slot.startTime} - {slot.endTime}
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
              Additional Notes{" "}
              <span className="text-slate-400">(Optional)</span>
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

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  doctorId: "",
                  specialty: "",
                  serviceType: "",
                  date: "",
                  time: "",
                  reason: "",
                  notes: "",
                })
              }
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Icon icon="mdi:loading" className="animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <Icon icon="mdi:calendar-check" />
                  Book Appointment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentForm;
