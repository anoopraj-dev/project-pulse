import crypto from 'crypto';
import Payment from '../../models/payments.model.js'
import Wallet from '../../models/wallet.model.js'

export const handleRazorpayWebhook = async ( req , res) => {
    try {

        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers['x-razorpay-signature']

        //------------- Verify Signature ---------------
        const generatedSignature = crypto
            .createHmac('sha256',webhookSecret)
            .update(req.body)
            .digest('hex')
        
        if(generatedSignature !== signature){
            return res.status(400).json({success:false,message:'Invalid signature'})
        }

        //--------------- Parse Webhook payload -------------
        const event = JSON.parse(req.body.toString());
        const {event:eventType,payload} = event;

        const orderId = payload?.payment?.entity?.order_id;
        const paymentId = payload?.payment?.entity?.id;
        const amount = payload?.payment?.entity?.amount;
        const status = payload?.payment?.entity?.status;

        if(!orderId){
            return res.status(400).json({
                success:false,
                message:'Order ID missing'
            })
        }

        //------------- Update payment record -------------
        const payment = await Payment.findOneAndUpdate(
            {orderId},
            {
                paymentId,
                status
            },
            { new:true}
        )

        if(!payment){
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        //------------ Update Wallets ---------------
        if(status === 'captured'){ //--------- successful payment
            await Wallet.findOneAndUpdate(
                {user:'admin'},
                {$inc: {balance: amount/100}},
                {upsert: true, new: true}
            )
        }else if (status === 'refunded'){
            await Wallet.findOneAndUpdate(
                {user:'admin'},
                {$inc: {balance: -(amount)/100}},
                {new:true}
            )
        }

        return res.status(200).json({success:true})
    } catch (error) {
        console.log('Webhook error',error)
        return res.status(500).json({ success: false, message: 'Webhook failed' });
    }
}