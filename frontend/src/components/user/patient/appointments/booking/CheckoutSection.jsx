import { Icon } from "@iconify/react";
import PaymentButton from "@/components/shared/components/PaymentButton";

const CheckoutSection = ({
  hasBookingInfo,
  activeDoctor,
  formData,
  amountToPay,
  paymentMethod,
  setPaymentMethod,
  handleBooking,
  handleWalletPayment,
  user,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Doctor card */}
      {hasBookingInfo && (
        <div className=" overflow-hidden rounded-2xl bg-gradient-to-br from-[#0096C7] to-[#0077B6] px-5 py-4 flex items-center gap-4">
          <div className="absolute -top-10 -right-7 w-28 h-28 rounded-full bg-white/[0.09]" />
          <div className="absolute -bottom-5 left-10 w-18 h-18 rounded-full bg-white/[0.06]" />
          <img
            src={activeDoctor?.profileImage || "/profile.png"}
            className="  w-11 h-11 rounded-full object-cover border-2 border-white/30 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {activeDoctor?.doctorName}
            </p>
            <p className="text-white/65 text-xs mt-0.5">
              {activeDoctor?.specialty}
            </p>
          </div>
          <span className="text-[11px] font-medium text-white bg-white/[0.18] border border-white/25 px-2.5 py-1 rounded-full shrink-0">
            Available
          </span>
        </div>
      )}

      {/* Summary card */}
      <div className=" overflow-hidden rounded-2xl bg-white border border-sky-200 px-5 py-5">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-sky-50" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-sky-50" />
        <div className="absolute top-1/2 right-3 w-12 h-12 rounded-full bg-sky-50/70 -translate-y-1/2" />
        <div className="">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sky-300 mb-3.5">
            Appointment summary
          </p>
          <div className="space-y-2.5">
            {[
              { label: "Service", value: formData.serviceType || "—" },
              { label: "Date", value: formData.date || "—" },
              { label: "Time", value: formData.time || "—" },
            ].map(({ label, value }, i) => (
              <div key={i}>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">{label}</span>
                  <span className="text-sm font-medium text-sky-950">
                    {value}
                  </span>
                </div>
                {i < 2 && <div className="h-px bg-sky-100 mt-2.5" />}
              </div>
            ))}
            <div className="h-px bg-sky-200 mt-1" />
            <div className="flex justify-between items-center pt-0.5">
              <span className="text-sm font-semibold text-sky-950">Total</span>
              <span className="text-[22px] font-bold text-[#0096C7] tracking-tight">
                ₹{amountToPay || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-sky-200 px-5 py-5">
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-sky-50" />
        <div className="absolute -bottom-5 right-14 w-16 h-16 rounded-full bg-sky-50/70" />
        <div className="relative ">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sky-300 mb-3">
            Payment method
          </p>
          <div className="flex gap-2 mb-2.5">
            <button
              type="button"
              onClick={() => setPaymentMethod("razorpay")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                paymentMethod === "razorpay"
                  ? "bg-gradient-to-br from-[#0096C7] to-[#0077B6] text-white border-none"
                  : "bg-transparent border border-sky-100 text-slate-400"
              }`}
            >
              <Icon icon="mdi:credit-card-outline" className="text-base" />
              Razorpay
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("wallet")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                paymentMethod === "wallet"
                  ? "bg-gradient-to-br from-[#0096C7] to-[#0077B6] text-white border-none"
                  : "bg-transparent border border-sky-100 text-slate-400"
              }`}
            >
              <Icon icon="mdi:wallet-outline" className="text-base" />
              Wallet
            </button>
          </div>

          {paymentMethod === "razorpay" ? (
            <PaymentButton
              amount={amountToPay}
              role="patient"
              user={user}
              doctorId={formData.doctorId}
              bookingData={formData}
              onSuccess={(orderId) =>
                handleBooking({
                  ...formData,
                  doctorId: activeDoctor?.doctorId,
                  paymentMethod: "razorpay",
                  orderId,
                })
              }
              className="w-full py-3 bg-gradient-to-br from-[#0096C7] to-[#0077B6] text-white rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all"
            />
          ) : (
            <button
              type="button"
              onClick={()=>handleWalletPayment({
                ...formData,
                doctorId: activeDoctor?.doctorId,
                paymentMethod:'wallet',
              })}
              disabled={!amountToPay}
              className="w-full py-3 bg-gradient-to-br from-[#0096C7] to-blue-400 text-white rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Pay ₹{amountToPay || 0} with Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSection;
