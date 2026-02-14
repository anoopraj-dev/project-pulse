import { useState } from "react";
import { Icon } from "@iconify/react";

const BookAppointmentForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    doctorId: "",
    specialty: "",
    date: "",
    time: "",
    reason: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dummy doctors data - replace with API call
  const doctors = [
    { _id: "1", name: "Dr. John Smith", specialty: "Cardiology" },
    { _id: "2", name: "Dr. Emily Johnson", specialty: "Neurology" },
    { _id: "3", name: "Dr. Michael Brown", specialty: "Dermatology" },
    { _id: "4", name: "Dr. Sarah Davis", specialty: "Pediatrics" },
  ];

  const specialties = [
    "Cardiology",
    "Neurology",
    "Dermatology",
    "Pediatrics",
    "Orthopedics",
    "General Medicine",
  ];

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace with actual API call
      // const res = await bookAppointment(formData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Appointment booked successfully!");
      setFormData({
        doctorId: "",
        specialty: "",
        date: "",
        time: "",
        reason: "",
        notes: "",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to book appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDoctors = formData.specialty
    ? doctors.filter((doc) => doc.specialty === formData.specialty)
    : doctors;

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-200">
            <Icon icon="mdi:calendar-plus" className="text-2xl text-indigo-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            Book New Appointment
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Fill in the details below to schedule your appointment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Specialty Selection */}
          <div>
            <label
              htmlFor="specialty"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Specialty <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              
              <select
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                required
                className="w-full rounded-sm border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Select a specialty</option>
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Doctor Selection */}
          <div>
            <label
              htmlFor="doctorId"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Doctor <span className="text-red-500">*</span>
            </label>
            <div className="relative">
             
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
                disabled={!formData.specialty}
                className="w-full rounded-sm border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">
                  {formData.specialty
                    ? "Select a doctor"
                    : "Select specialty first"}
                </option>
                {filteredDoctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} - {doc.specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
               
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  required
                  className="w-full rounded-sm border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-sm border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Reason for Visit */}
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Reason for Visit <span className="text-red-500">*</span>
            </label>
            <div className="relative">
            
              <input
                type="text"
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                placeholder="e.g., Regular checkup, Follow-up consultation"
                className="w-full rounded-sm border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Additional Notes <span className="text-slate-400">(Optional)</span>
            </label>
            <div className="relative">
              <Icon
              
                className="absolute left-3 top-3 text-slate-400"
              />
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Any specific concerns or symptoms you'd like to discuss..."
                className="w-full rounded-sm border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  doctorId: "",
                  specialty: "",
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