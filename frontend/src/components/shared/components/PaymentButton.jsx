import { createRazorpayOrder, verifyRazorpayPayment } from '@/api/user/userApis'
import { updatePaymentStatus } from '@/api/patient/patientApis';
import React from 'react'
import toast from 'react-hot-toast';

const PaymentButton = ({amount,user,role,doctorId,onSuccess}) => {

    const handlePayment = async () => {
        try {  
            
            const response = await createRazorpayOrder(amount,role,doctorId);

            if(!response.data?.success){
                return toast.error('Failed to create order')
            }

            const order = response.data.order;

            const options = {
                key:'rzp_test_SHT0I540nrXiPh',
                amount:order.amount,
                currency:order.currency,
                name:'Pulse360',
                description:'Payment Transaction',
                order_id:order.id,
                handler: async function (response){

                    //--------------- Verify payment on server ---------------
                    const verifyRes = await verifyRazorpayPayment(
                        {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        },
                        role
                    );

                    //---------------- Update payment Status, Wallet & Transactions -----------------
                    const updateRes = await updatePaymentStatus({
                        orderId:response.razorpay_order_id,
                        status:'verified',
                        notes:'Patient completed payment'
                    })

                    console.log(updateRes)

                    if(!updateRes.data?.success) return toast.error( 'Failed to update Wallet and status');

                    toast.success('Wallet updated')

                    if(verifyRes.data?.success){
                        toast.success(`Payment Successful!`);
                        
                        if(onSuccess){
                            onSuccess(order.id);   //  Controll passed to the parent
                        }

                    } else {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name:user.name,
                    email:user.email
                },
                theme: {color: '#0096C7'}
            };

            const rzp = new window.Razorpay(options);
            rzp.open()

        } catch (error) {
            console.log(error)
            toast.error('Payment failed. Please try again')
        }
    }

  return (
    <button
        type='button'
        onClick={handlePayment}
        className="px-6 py-2 bg-[#0096C7] text-white rounded hover:bg-blue-600"
    >
      Pay ₹{amount}
    </button>
  )
}

export default PaymentButton
