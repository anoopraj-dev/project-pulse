
import OtpInputs from '../components/OtpInputs'

const ResetPassword = () => {
  return (
    <div className='grid grid-cols-2 justify-center items-center h-screen'>
        <div>
            <img src="./loginbanner.jpg" alt="" className='w-ful object-cover h-screen'/>
            
        </div>

        <div className='flex justify-center items-center'>
             <OtpInputs/>
        </div>
     
    </div>
  )
}

export default ResetPassword
