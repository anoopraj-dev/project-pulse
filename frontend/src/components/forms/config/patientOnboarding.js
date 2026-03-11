// src/components/forms/config/patientOnboarding.js

// ---------- STEP 1 : PERSONAL INFO (WITH PROFILE PICTURE) ----------

const patientPersonalInfoConfig = {
  title: "Personal Information",
  buttonText: "Next",
  fields: [
    {
      name: "gender",
      label: "Gender",
      type: "radio",
      options: ["male", "female", "other"],
      required: true,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text",
      required: true,
      validation: {
        required: "Phone number is required",
        pattern: {
          value: /^[6-9]\d{9}$/,
          message: "Enter a valid 10 digit phone number",
        },
    },
  },
    {
      name: "work",
      label: "Work",
      type: "text",
      required: true,
    },
    {
      name: "address",
      label: "Address",
      type: "textarea",
      required: true,
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
      required: true,
      max:new Date().toISOString().split('T')[0]
    },
    {
      name: "profilePicture",
      label: "Profile Picture",
      type: "file",
      required: false,
      uploadButton: true,
    },
  ],
};

// ---------- STEP 2 : MEDICAL INFO ----------

const patientMedicalInfoConfig = {
  title: "Medical Information",
  buttonText: "Next",
  fields: [
    {
      name: "bloodGroup",
      label: "Blood Group",
      type: "select",
      options: ["A+","A−","B+","B−","AB+","AB−","O+","O−"],
    },
    {
      name: "bloodPressure",
      label: "Blood Pressure (mmHg)",
      type: "number",
    },
    {
      name: "sugarLevel",
      label: "Sugar Level (mg/dL)",
      type: "number",
    },
    {
      name: "cholesterol",
      label: "Cholesterol (mg/dL)",
      type: "number",
    },
    {
      name: "height",
      label: "Height (cm)",
      type: "number",
    },
    {
      name: "weight",
      label: "Weight (kg)",
      type: "number",
    },
    {
      name: "medicalConditions",
      label: "Medical Conditions",
      type: "textarea",
    },
    {
      name: "allergies",
      label: "Allergies",
      type: "textarea",
    },
  ],
};

// ---------- STEP 3 : LIFESTYLE INFO  ----------

const patientLifestyleInfoConfig = {
  title: "Lifestyle & Habits",
  buttonText: "Submit",
  fields: [
    {
      name: "smoking",
      label: "Do you smoke?",
      type: "radio",
      options: ["No", "Occasionally", "Regularly"],
    },
    {
      name: "alcohol",
      label: "Do you consume alcohol?",
      type: "radio",
      options: ["No", "Occasionally", "Regularly"],
    },
    {
      name: "exerciseFrequency",
      label: "How often do you exercise?",
      type: "select",
      options: ["Never", "1-2 times/week", "3-4 times/week", "Daily"],
    },
    {
      name: "diet",
      label: "Dietary Preferences / Restrictions",
      type: "textarea",
      placeholder: "e.g., Vegetarian, Vegan, Low Carb",
    },
    {
      name: "sleepHours",
      label: "Average Sleep Duration (hours/day)",
      type: "number",
      min: 0,
      max: 24,
    },
    {
      name: "stressLevel",
      label: "Stress Level",
      type: "select",
      options: ["Low", "Moderate", "High", "Very High"],
    },
    {
      name: "waterIntake",
      label: "Daily Water Intake (liters)",
      type: "number",
      step: 0.1,
    },
    {
      name: "caffeineIntake",
      label: "Caffeine Consumption",
      type: "radio",
      options: ["None", "1-2 cups/day", "3-4 cups/day", "5+ cups/day"],
    },
    {
      name: "physicalActivityType",
      label: "Physical Activity Type",
      type: "checkbox",
      options: [
        "Walking",
        "Running",
        "Cycling",
        "Gym/Weights",
        "Yoga/Pilates",
        "Other",
      ],
    },
    {
      name: "screenTime",
      label: "Average Daily Screen Time (hours)",
      type: "number",
      min: 0,
      max: 24,
    },
    {
      name: "otherHabits",
      label: "Other Habits or Notes",
      type: "textarea",
    },
  ],
};

// ---------- FINAL EXPORT ----------

export const patientOnboarding = {
  personalInfo: patientPersonalInfoConfig,
  medicalInfo: patientMedicalInfoConfig,
  lifestyleInfo: patientLifestyleInfoConfig,
};
