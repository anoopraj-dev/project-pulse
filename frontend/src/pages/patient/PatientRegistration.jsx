import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicForm from "../../components/DynamicForm";
import { formSteps } from "../../constants/formStepConfig";
import Headings from "../../components/Headings";
import { useUser } from "../../contexts/UserContext";
import { api } from "../../api/api";
import { useModal } from "../../contexts/ModalContext";

const PatientRegistration = () => {
  const stepKeys = Object.keys(formSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const { email, id } = useUser();
  const navigate = useNavigate();
  const { openModal } = useModal();

  const handleNext = async (data) => {
    if (!email || !id) return;

    try{
        const formData = new FormData();
        formData.append('email',email);
        formData.append('patientId',id);

        Object.entries(data).forEach(([key,value])=>{
            formData.append(key,value)
        });

        if(currentStep === 0) {
            const response = await api.post('/api/patient/registration',formData);
            if(!response.data.success){
                openModal(response.data.message);
                return;
            }
            openModal(response.data.message);
            setCurrentStep(currentStep+1);
        }

        else if(currentStep===1){
            const response = await api.post ('/api/patient/medical-info',formData);
            if(!response.data.success){
                openModal(response.data.message);
                return;
            }
            openModal(response.data.message);
            navigate('/patient/profile');
        }
    }catch(error){
        console.log(error);
        

    if (currentStep < stepKeys.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl p-10">
        <Headings
          text={
            currentStep === 0
              ? "Tell us about yourself"
              : "How are you keeping up"
          }
        />

        <div className="flex items-center justify-center my-6 space-x-6">
          {stepKeys.map((key, index) => (
            <div key={key} className="flex items-center">
              <div
                className={`rounded-full flex items-center justify-center w-12 h-12 ${
                  currentStep === index
                    ? "bg-[#0096C7] text-white"
                    : "border border-[#0096C7]"
                }`}
              >
                <span className="font-bold">{index + 1}</span>
              </div>
              {index < stepKeys.length - 1 && (
                <hr className="w-96 border border-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>

        <DynamicForm
          config={formSteps[stepKeys[currentStep]]}
          onSubmit={handleNext}
        />
      </div>
    </div>
  );
};
}
export default PatientRegistration;

