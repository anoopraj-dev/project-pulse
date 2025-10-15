export const formSteps = {
  personalInfo: {
    title: "Personal Information",
    fields: [
      { name: "gender", label: "Gender", type: "radio", options: ["Male", "Female", "Other"] },
      { name: "phone", label: "Phone Number", type: "text" },
      { name: "work", label: "Work", type: "text" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "dob", label: "Date of Birth", type: "date" },
      { name: "picture", label: "Profile Picture", type: "file" },
    ],
  },
  medicalInfo: {
    title: "Medical Information",
    fields: [
      { name: "bloodGroup", label: "Blood Group", type: "select",options:["A+","A−","B+","B−","AB+","AB−","O+","O−"] },
      { name: "bloodPressure", label: "Blood Pressure", type: "text" },
      { name: "sugarLevel", label: "Sugar Level", type: "text" },
      { name: "cholesterol", label: "Cholesterol", type: "text" },
      { name: "height", label: "Height (cm)", type: "number" },
      { name: "weight", label: "Weight (kg)", type: "number" },
      { name: "medicalConditions", label: "Medical Conditions", type: "textarea" },
      { name: "allergies", label: "Allergies", type: "textarea" },
    ],
  },
};
