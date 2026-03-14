import React from "react";
import toast from "react-hot-toast";
import { createRazorpayOrder } from "@/api/user/userApis";
import { handleRazorpayPayment } from "@/utilis/handleRazorpayPayment";
import { useNavigate } from "react-router-dom";

const PaymentButton = ({
  amount,
  user,
  role,
  doctorId,
  bookingData,
  onSuccess,
}) => {
  const navigate = useNavigate();

  

  const handlePayment = async () => {
    try {

    //------------------ Create Razorpay order ---------------
      const response = await createRazorpayOrder({
        amount,
        role,
        doctorId,
        ...bookingData,
      });

      if (!response.data?.success) {
        return toast.error("Failed to create order");
      }

      await handleRazorpayPayment({
        order: response.data.order,
        role,
        user,
        onSuccess,
        onFailure: () => {
          navigate("/patient/payments");
        },
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response.data?.message ||'Payment failed! Try agin');
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      className="w-full py-3 bg-gradient-to-br from-[#0096C7] to-[#0077B6] text-white rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Pay ₹{amount} with Razorpay
    </button>
  );
};

export default PaymentButton;
