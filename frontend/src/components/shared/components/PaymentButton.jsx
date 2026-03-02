import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "@/api/user/userApis";
import { updatePaymentStatus } from "@/api/patient/patientApis";
import React from "react";
import toast from "react-hot-toast";

const PaymentButton = ({ amount, user, role, doctorId, onSuccess }) => {
  const handlePayment = async () => {
    try {
      const response = await createRazorpayOrder(amount, role, doctorId);

      if (!response.data?.success) {
        return toast.error("Failed to create order");
      }

      const order = response.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Pulse360",
        description: "Payment Transaction",
        order_id: order.id,

        retry: {
          enabled: true,
          max_count: 3,
        },

        handler: async function (response) {
          try {
            //--------------- Verify payment on server ---------------
            const verifyRes = await verifyRazorpayPayment(
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              role,
            );

            if (!verifyRes.data?.success) {
              toast.error("Paymet verification failed");
              return;
            }

            //---------------- Update payment Status, Wallet & Transactions -----------------
            const updateRes = await updatePaymentStatus({
              orderId: response.razorpay_order_id,
              status: "verified",
              notes: "Patient completed payment",
            });

            console.log(updateRes);

            if (!updateRes.data?.success)
              return toast.error("Failed to update Wallet and status");

            toast.success(`Payment Successful!`);

            if (onSuccess) {
              onSuccess(order.id); //  Controll passed to the parent
            }
          } catch (error) {
            console.log(error);
            toast.error('Something went wrong during payment')
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#0096C7" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", async function (response) {
        try {
          await updatePaymentStatus({
            orderId: response.error.metadata.order_id,
            paymentId:response.error.metadata.payment_id || null,
            method:response.error.metadata.method || null,
            status: "failed",
            notes: response.error.description,
          });

          toast.error(response.error.description || "Payment Failed");
        } catch (error) {
          console.log(error);
          toast.error("Failed to update payment Status");
        }
      });
    } catch (error) {
      console.log(error);
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
