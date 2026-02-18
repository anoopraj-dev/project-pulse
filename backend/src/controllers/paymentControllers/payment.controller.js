import Razorpay from 'razorpay'
import crypto from 'crypto'
import Payment from '../../models/payments.model.js'

const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

//--------------- Create Razorpay Order --------------
export const createOrder = async(req,res) =>{
    const {amount,doctorId} = req.body;

    try {
        const options = {
            amount: amount*100, // ------- convert to paise
            currency:'INR',
            receipt:`receipt_${Date.now()}`
        }

        const order = await razorpay.orders.create(options);
        
        await Payment.create({
            patient: req.user.id,
            doctor:doctorId,
            orderId: order.id,
            amount:order.amount,
            currency:order.currency,
            receipt:order.receipt,
            status:'created'
        })

        res.status(200).json({
            success:true,
            order
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            error:error.message
        })
    }
}

//----------------- Verify Payment ----------------
export const verifyPayment = async(req,res) =>{
    try {
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;
    
    const generated_signature = crypto
        .createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex')

         if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Signature"
      });
    }

    const payment = await Payment.findOneAndUpdate(
        {orderId: razorpay_order_id},
        {
            paymentId:razorpay_payment_id,
            signature:razorpay_signature,
            status:'verified'
        },
        {new: true}
    )

    if(!payment){
        return res.status(404).json({
            success:false,
            message:'Payment record not found'
        })
    }

  

    return res.status(200).json({
        success: true,
        message:'Payment Verified'
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Verification failed'
        })
    }

}