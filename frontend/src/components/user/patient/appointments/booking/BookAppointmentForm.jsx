import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@/contexts/UserContext";
import {
  bookAppointment,
  fetchAppointments,
  getBookingInfo,
  walletPayment,
} from "@/api/patient/patientApis";
import { fetchSearchSuggestions } from "@/api/user/userApis";
import DoctorSearchSection from "./DoctorSearchSection";
import AppointmentFormSection from "./AppointmentFormSection";
import CheckoutSection from "./CheckoutSection";

const BookAppointmentForm = ({ bookingInfo, setActiveTab }) => {
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [query, setQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const user = useUser();

  const activeDoctor = selectedDoctor || bookingInfo;
  const hasBookingInfo = !!activeDoctor?.doctorId;

  const [formData, setFormData] = useState({
    doctorId: "",
    specialty: "",
    serviceType: "",
    date: "",
    time: "",
    reason: "",
    notes: "",
  });

  // ---------- Prefill when bookingInfo exists ----------
  useEffect(() => {
    if (!activeDoctor?.doctorId) return;

    setFormData((prev) => ({
      ...prev,
      doctorId: activeDoctor?.doctorId,
      specialty: activeDoctor?.specialty || "",
    }));
  }, [activeDoctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "date" ? { time: "" } : {}),
    }));
  };


  console.log("BOOKING INFO RESPONSE:", bookingInfo);


  // -------------------- Get available dates --------------------
const getAvailableDates = () => {
  if (!hasBookingInfo) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return activeDoctor?.availability
    ?.map((day) => day.date)
    .filter((date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d >= today;
    });
};

const availableSlots = () => {
  if (!hasBookingInfo || !formData.date) return [];

  const day = activeDoctor?.availability?.find(
    (d) => d.date === formData.date
  );

  if (!day?.slots) return [];

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return day.slots.filter((slot) => {
    const [h, m] = slot.start.split(":").map(Number);
    const slotMinutes = h * 60 + m;

    return slotMinutes > nowMinutes;
  });
};

  const today = new Date().toISOString().split("T")[0];

  //------------- amount to pay --------------
  const selectedService = activeDoctor?.services?.find(
    (s) => s.serviceType === formData.serviceType,
  );

  const amountToPay = selectedService?.fees;

  //------------------- Handle wallet payment -----------------
  const handleWalletPayment = async () => {
    try {
      const res = await walletPayment({
        ...formData,
        amount: amountToPay,
      });


      let payload;
      if (res.data?.success) {
        payload = {
          ...formData,
          paymentMethod: res.data?.payment?.method,
          doctorId: res.data?.payment?.doctor,
          orderId: res.data?.payment?.orderId,
        };

        handleBooking(payload);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  //--------------------- Handle Book appointment -------------
  const handleBooking = async (payload) => {
    try {
      const res = await bookAppointment(payload);

      if (res.data?.success) {
        await fetchAppointments();
        setActiveTab("confirmed");
        toast.success("Appointment booked successfully");
      } else {
        toast.error("Failed to book appointment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  //------------------- Search Suggestions ------------
  const fetchSuggestions = (query) => {
    return fetchSearchSuggestions({
      role: "patient",
      query,
      type: "doctors",
    });
  };

  //---------------- Select search suggestion --------------------
  const handleSelectSuggestion = async (item) => {
    try {
      setQuery(item.name);

      if(!item?._id) {
        console.error('Invalid doctor Item:',item);
        return 
      }

      const res = await getBookingInfo(item._id);

      if (res.data?.success) {
        const doctor = res.data.bookingInfo;

        setSelectedDoctor(doctor);

        setFormData({
          doctorId: doctor.doctorId,
          specialty: doctor.specialty || "",
          serviceType: doctor.services?.[0]?.serviceType || "",
          date: "",
          time: "",
          reason: "",
          notes: "",
        });
      }
    } catch (error) {
      console.error("Booking info error:", error);
      toast.error("Failed to load doctor availability");
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <DoctorSearchSection
        query={query}
        setQuery={setQuery}
        fetchSuggestions={fetchSuggestions}
        handleSelectSuggestion={handleSelectSuggestion}
      />

      <div className="grid sm:grid-cols-1 md:grid-cols-2 space-x-6 space-y-2">
        <AppointmentFormSection
          hasBookingInfo={hasBookingInfo}
          activeDoctor={activeDoctor}
          formData={formData}
          handleChange={handleChange}
          getAvailableDates={getAvailableDates}
          availableSlots={availableSlots}
          today={today}
        />

        <CheckoutSection
          hasBookingInfo={hasBookingInfo}
          activeDoctor={activeDoctor}
          formData={formData}
          amountToPay={amountToPay}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          handleBooking={handleBooking}
          handleWalletPayment={handleWalletPayment}
          user={user}
        />
      </div>
    </div>
  );
};

export default BookAppointmentForm;
