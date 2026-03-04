import toast from "react-hot-toast";
import { verifyRazorpayPayment } from "@/api/user/userApis";
import { updatePaymentStatus } from "@/api/patient/patientApis";

export const handleRazorpayPayment = async ({
  order,
  role,
  user,
  onSuccess,
  onFailure,
}) => {
  if (!window.Razorpay) {
    toast.error("Razorpay SDK not loaded");
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: "Pulse360",
    description: "Payment Transaction",
    order_id: order.id,

    retry: { enabled: false },

    modal: {
      ondismiss: function () {
        toast.error("Payment cancelled!");
      },
    },

    //---------------- Verify payment on success ----------------
    handler: async function (response) {
      try {
        //--------------- Verify payment on server ---------------
        const verifyRes = await verifyRazorpayPayment(
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          },
          role
        );

        if (!verifyRes.data?.success) {
          toast.error("Payment verification failed");
          return;
        }

        //---------------- Update payment status -----------------
        const updateRes = await updatePaymentStatus({
          orderId: response.razorpay_order_id,
          status: "verified",
          notes: "Patient completed payment",
        });

        if (!updateRes.data?.success) {
          return toast.error("Failed to update Wallet and status");
        }

        toast.success("Payment Successful!");

        if (onSuccess) {
          onSuccess(order.id);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong during payment");
      }
    },

    prefill: {
      name: user?.name,
      email: user?.email,
    },

    theme: { color: "#0096C7" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();

  //---------------- Handle payment failure ----------------
  rzp.on("payment.failed", async function (response) {
    try {
      rzp.close();

      await updatePaymentStatus({
        orderId: response.error.metadata.order_id,
        paymentId: response.error.metadata.payment_id || null,
        method: response.error.metadata.method || null,
        status: "failed",
        notes: response.error.description,
      });

      toast.error(response.error.description || "Payment Failed");

      if (onFailure) {
        onFailure();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update payment Status");
    }
  });
};