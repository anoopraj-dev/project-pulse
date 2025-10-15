import { useState } from "react";
import {toast} from 'react-hot-toast'
import DynamicForm from "./DynamicForm";
import { emailInputConfig, setPasswordFormConfig } from "../formConfigs/modalConfigs";
import { api } from "../api/api";



export const EmailModal = ({ endPoint, type, onSubmit, closeModal }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      const payload = {...formData,type};

      const { data } = await api.post(endPoint, payload);
      sessionStorage.setItem('otpSession', JSON.stringify(payload));

      if (data.success) {
        toast.success(data.message || "Submitted successfully!");
        if (onSubmit) onSubmit(data); 
        closeModal();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit form. Try again."
      );
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="flex flex-col">
      <DynamicForm config={emailInputConfig} onSubmit={handleSubmit} mode="modal" loading={loading} />
    </div>
  );
};



export const SetPasswordModal = ({ endPoint, type, onSubmit, closeModal }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const payload = { ...formData, type };
      const { data } = await api.post(endPoint, payload);
      sessionStorage.setItem('forgotPasswordVerification', JSON.stringify(payload));

      if (data.success) {
        toast.success(data.message || "Password set successfully!");
        if (onSubmit) onSubmit(data);
        closeModal();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit form. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DynamicForm config={setPasswordFormConfig} onSubmit={handleSubmit} mode="modal" loading={loading}
    />
  );
};