const doctorPersonalInfoConfig = {
  title: "Personal Information",
  buttonText: "Next",
  fields: [
    
    { name: "dob", label: "Date of Birth", type: "date", required: true },
    { name: "gender", label: "Gender", type: "radio", options: ["male", "female", "other"], required: true },
    { name: "phone", label: "Phone", type: "text", required: true },
    { name: "clinicName", label: "Clinic Name", type: "text", required: true },
    { name: "clinicAddress", label: "Clinic Address", type: "textarea", required: true },
    { name: "about", label: "About Yourself", type: "textarea", required: false },
    { name: "profilePic", label: "Profile Picture", type: "file", accept: "image/*", required: false },
  ],
};

const doctorProfessionalInfoConfig = {
  title: "Professional Information",
  buttonText: "Next",
  fields: [
    { name: "qualifications", label: "Qualifications", type: "textarea", required: true, placeholder: "Enter your qualifications" },
    { name: "specializations", label: "Specializations", type: "textarea", required: true, placeholder: "Enter your specializations" },
    
    // Experience Section (repeatable)
    { 
      name: "experience", 
      label: "Experience", 
      type: "repeatable", 
      fields: [
        { name: "years", label: "Years", type: "number", required: true },
        { name: "hospital", label: "Hospital Name", type: "text", required: true },
        { name: "location", label: "Location", type: "text", required: true },
      ]
    },

    // Education Section (repeatable)
    {
      name: "education",
      label: "Education",
      type: "repeatable",
      fields: [
        { name: "degree", label: "Degree", type: "text", required: true },
        { name: "college", label: "College Name", type: "text", required: true },
        { name: "completionYear", label: "Completion Year", type: "number", required: true },
        { name: "certificate", label: "Certificate Upload", type: "file", accept: "application/pdf,image/*", required: false },
      ]
    }
  ],
};

const doctorServicesConfig = {
  title: "Services & Availability",
  buttonText: "Submit",
  fields: [
    {
      name: "services",
      label: "Services Offered",
      type: "checkbox",
      options: ["online", "offline"],
      required: true
    },
    
    // Fees per service
    {
      name: "fees",
      label: "Service Fees",
      type: "group",
      fields: [
        { name: "onlineFee", label: "Online Consultation Fee", type: "number", required: true },
        { name: "offlineFee", label: "Offline Consultation Fee", type: "number", required: true }
      ]
    },

    { name: "availableDays", label: "Available Days", type: "text", placeholder: "e.g., Mon, Wed, Fri", required: true },
    { name: "availableTime", label: "Available Time", type: "text", placeholder: "e.g., 10:00 AM - 4:00 PM", required: true },
  ],
};


export const doctorStepsConfig = {
  personalInfo: doctorPersonalInfoConfig,
  professionalInfo: doctorProfessionalInfoConfig,
  services: doctorServicesConfig,
};