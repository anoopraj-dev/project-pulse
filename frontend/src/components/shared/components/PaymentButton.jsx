
import React from "react";
import toast from "react-hot-toast";
import { createRazorpayOrder } from "@/api/user/userApis";
import { handleRazorpayPayment } from "@/utilis/handleRazorpayPayment";
import { useNavigate } from "react-router-dom";

const PaymentButton = ({ amount, user, role,doctorId, bookingData, onSuccess }) => {
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      console.log('bookingData',bookingData)
      const response = await createRazorpayOrder({amount, role,doctorId,...bookingData});

      if (!response.data?.success) {
        return toast.error("Failed to create order");
      }

      await handleRazorpayPayment({
        order: response.data.order,
        role,
        user,
        onSuccess,
        onFailure:() =>{
          navigate('/patient/payments')
        },
      });

    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again");
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      className="px-6 py-2 bg-[#0096C7] text-white rounded hover:bg-blue-600"
    >
      Pay ₹{amount}
    </button>
  );
};

export default PaymentButton;