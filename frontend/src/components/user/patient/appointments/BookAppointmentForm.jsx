import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import PaymentButton from "@/components/shared/components/PaymentButton";
import { useUser } from "@/contexts/UserContext";
import { bookAppointment } from "@/api/patient/patientApis";

const BookAppointmentForm = ({ bookingInfo, setActiveTab }) => {
  const [formData, setFormData] = useState({
    doctorId: "",
    specialty: "",
    serviceType: "",
    date: "",
    time: "",
    reason: "",
    notes: "",
  });

  const user = useUser();

 
  const hasBookingInfo = !!bookingInfo?.doctorId;


  //---------- Prefill when bookingInfo exists ----------
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

  //-------------------- Get available dates ------------
  const getAvailableDates = () => {
    if (!hasBookingInfo) return [];

    const now = new Date();
    return bookingInfo.availability
      .map((day) => new Date(day.date))
      .filter((date) => {
        return date >= new Date(now.setHours(0, 0, 0, 0));
      })
      .map((date) => date.toISOString().split("T")[0]);
  };

  const availableSlots = () => {
    if (!hasBookingInfo || !formData.date) return [];

    const day = bookingInfo.availability?.find(
      (d) => d.date.split("T")[0] === formData.date,
    );

    if (!day?.slots) return [];

    const now = new Date();
    return day.slots.filter((slot) => {
      const slotDateTime = new Date(`${formData.date}T${slot.startTime}`);
      // Allow only if slot is at least 1 hour ahead
      return slotDateTime.getTime() - now.getTime() >= 60 * 60 * 1000;
    });
  };

  const today = new Date().toISOString().split("T")[0];

  //------------- amount to pay --------------
  const selectedService = bookingInfo?.services?.find(
    (s) => s.serviceType === formData.serviceType
  );
  const amountToPay = selectedService?.fees;

  //--------------------- Handle Book appointment -------------
  const handleBooking = async (orderId) => {
    try {
        const res = await bookAppointment({...formData,orderId});

        if(res.data?.success){
            setActiveTab('pending')
            toast.success("Appointment booked successfully");
        } else {
            toast.error("Failed to book appointment");
        }

    } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
    }
};


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
              className="rounded border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>

            {/* ------------- Payment Button ------------- */}
            <PaymentButton
              amount={amountToPay}
              role='patient'
              user={user}
              doctorId={formData.doctorId}
              onSuccess={(orderId)=>handleBooking(orderId)}
              
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentForm;
