export const formSteps = {
  personalInfo: {
    title: "Personal Information",
    fields: [
      { name: "gender", label: "Gender", type: "radio", options: ["male", "female", "other"] },
      { name: "phone", label: "Phone Number", type: "text" },
      { name: "work", label: "Work", type: "text" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "dob", label: "Date of Birth", type: "date" },
      
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
   lifestyleInfo :{
  title: "Lifestyle & Habits",
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
      placeholder: "e.g., Vegetarian, Vegan, Low Carb, Gluten-Free",
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
      label: "How would you rate your stress level?",
      type: "select",
      options: ["Low", "Moderate", "High", "Very High"],
    },
    {
      name: "waterIntake",
      label: "Average Daily Water Intake (liters)",
      type: "number",
      min: 0,
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
      label: "Type of Physical Activity",
      type: "checkbox",
      options: ["Walking", "Running", "Cycling", "Gym/Weights", "Yoga/Pilates", "Other"],
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
      label: "Other Habits or Lifestyle Notes",
      type: "textarea",
      placeholder: "Anything else you would like to mention...",
    },
  ],
},

  profilePicture:{
    title: 'Upload your picture',
    fields:[
      { name: "picture", label: "Profile Picture", type: "file",uploadButton:true },
    ]
  }
};
