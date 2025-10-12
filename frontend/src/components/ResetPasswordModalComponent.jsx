import { useState } from "react";
import PrimaryButton from "./PrimaryButton";


const ResetPasswordModalComponent = ({ onSubmit }) => {
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [loading,setIsloading] = useState(false)
  const [response,setResponse] = useState('')
  const handleSubmit= async ()=>{
    setIsloading(true);
    try {
        await onSubmit({email,role,setResponse});
    } catch (error) {
       console.log(error) 
    }finally{
        setIsloading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <select
        className="border border-sky-400 p-4 rounded-sm"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
      </select>
      <input
        type="email"
        placeholder="Email"
        className="border border-sky-400 p-4 rounded-sm"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {
        response && (
            <p className="text-center text-sm text-red-500">{response}</p>
        )
      }

            <PrimaryButton
        className="mt-2 bg-[#0096C7] text-white px-4 py-2 rounded text-sm"
        onClick={handleSubmit}
        text= {loading ? 'Sending...': 'Submit'}
      />
    
      
 
    </div>
  );
};

export default ResetPasswordModalComponent;
