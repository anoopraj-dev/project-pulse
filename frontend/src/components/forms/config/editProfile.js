export const patientEditProfileConfig = {
  title: "Edit Profile",
  fields: [
    // ─────────────── Basic Information ───────────────
    
     {
      name: "basicInfo",
      type: "title",
      title: "Personal Information",
    },

    { name: "name", label: "Full Name", type: "text" },

    {
      name: "gender",
      label: "Gender",
      type: "radio",
      options: ["male", "female", "other"],
    },

    { name: "dob", label: "Date of Birth", type: "date" },
    { name: "phone", label: "Phone Number", type: "text" },
    { name: "work", label: "Occupation", type: "text" },
    { name: "address", label: "Address", type: "textarea" },

    // ─────────────── Medical Information ───────────────
    {
      name: "medicalInfo",
      type: "title",
      title: "Medical Information",
    },

    {
      name: "medical_history.bloodGroup",
      label: "Blood Group",
      type: "select",
      options: ["A+","A−","B+","B−","AB+","AB−","O+","O−"],
    },

    { name: "medical_history.bloodPressure", label: "Blood Pressure", type: "text" },
    { name: "medical_history.sugarLevel", label: "Sugar Level", type: "text" },
    { name: "medical_history.cholesterol", label: "Cholesterol", type: "text" },
    { name: "medical_history.height", label: "Height (cm)", type: "number" },
    { name: "medical_history.weight", label: "Weight (kg)", type: "number" },
    { name: "medical_history.medicalConditions", label: "Medical Conditions", type: "textarea" },
    { name: "medical_history.allergies", label: "Allergies", type: "textarea" },

    // ─────────────── Lifestyle & Habits ───────────────
    {
      name: "lifeStyle",
      type: "title",
      title: "Lifestyle & Habits",
    },

    {
      name: "lifestyle_habits.smoking",
      label: "Smoking",
      type: "radio",
      options: ["No", "Occasionally", "Regularly"],
    },

    {
      name: "lifestyle_habits.alcohol",
      label: "Alcohol",
      type: "radio",
      options: ["No", "Occasionally", "Regularly"],
    },

    {
      name: "lifestyle_habits.exerciseFrequency",
      label: "Exercise Frequency",
      type: "select",
      options: ["Never", "1-2 times/week", "3-4 times/week", "Daily"],
    },

    { name: "lifestyle_habits.sleepHours", label: "Sleep Hours", type: "number" },

    {
      name: "lifestyle_habits.stressLevel",
      label: "Stress Level",
      type: "select",
      options: ["Low", "Moderate", "High", "Very High"],
    },

    { name: "lifestyle_habits.waterIntake", label: "Water Intake (liters/day)", type: "number" },
    { name: "lifestyle_habits.screenTime", label: "Screen Time (hours/day)", type: "number" },
    { name: "lifestyle_habits.otherHabits", label: "Other Habits", type: "textarea" },
  ],
};
