const doctorPersonalInfoConfig = {
  title: "Personal Information",
  buttonText: "Next",
  fields: [
    { name: "dob", label: "Date of Birth", type: "date", required: true },
    {
      name: "gender",
      label: "Gender",
      type: "radio",
      options: ["male", "female", "other"],
      required: true,
    },
    { name: "phone", label: "Phone", type: "text", required: true },
    { name: "clinicName", label: "Clinic Name", type: "text", required: true },
    {
      name: "clinicAddress",
      label: "Clinic Address",
      type: "textarea",
      required: true,
    },
    {
      name: "about",
      label: "About Yourself",
      type: "textarea",
      required: false,
    },
     {
      name: "location",
      label: "Clinic Location",
      type: "text",
      required: true,
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


const doctorProfessionalInfoConfig = {
  title: "Professional Information",
  buttonText: "Next",
  fields: [
  // MANDATORY MEDICAL LICENSE 
   
    {
  name: "registrationNumber",
  label: "State Medical Council Reg No. *",
  type: "text",
  validation: {
    required: "Registration number is mandatory",
    pattern: /^[A-Z]{2,4}\d{4,6}$/i
  },
  helperText: "Format: [StateCode][Number]",
  required: true,
},
{
  name: "stateCouncil",
  label: "State Medical Council *",
  type: "select",
  options: [
    "Andhra Pradesh Medical Council (APMC)",
    "Delhi Medical Council (DMC)",
    "Karnataka Medical Council (KMC)",
    // ...
  ],
  required: true,
},
{
  name: "yearOfRegistration",
  label: "Year of Registration *",
  type: "number",
  min: 1950,
  max: new Date().getFullYear(),
  required: true,
},
{
  name: "proofDocument",
  label: "License Proof (PDF/JPG)",
  type: "file",
  accept: "image/*,.pdf",
  uploadButton: true,
  uploadType: "licenseProof",
  required: false
},

    // Existing fields...
    {
      name: "qualifications",
      label: "Qualifications",
      type: "textarea",
      required: true,
      placeholder: "Enter your qualifications",
    },
    {
      name: "specializations",
      label: "Specializations",
      type: "textarea",
      required: true,
      placeholder: "Enter your specializations",
    },
    
    // Experience Section (repeatable) - Add certificate upload
    {
      name: "experience",
      label: "Experience",
      type: "repeatable",
      fields: [
        { name: "years", label: "Years", type: "number", required: true },
        { name: "hospital", label: "Hospital Name", type: "text", required: true },
        { name: "location", label: "Location", type: "text", required: true },
       
      ],
    },

    // Education Section (repeatable) - Add certificate upload
    {
      name: "education",
      label: "Education",
      type: "repeatable",
      fields: [
        { name: "degree", label: "Degree", type: "text", required: true },
        { name: "college", label: "College Name", type: "text", required: true },
        { name: "completionYear", label: "Completion Year", type: "number", required: true },
    
      ],
    },
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
      required: true,
    },
   
    {
      name: "online_fee",
      label: "Online Fee",
      type: "number",
      placeholder: "₹0",
      condition: { 
        dependsOn: "services", 
        type: "includes", 
        value: "online" 
      },
    },
    {
      name: "offline_fee", 
      label: "Offline Fee",
      type: "number",
      placeholder: "₹0",
      condition: { 
        dependsOn: "services", 
        type: "includes", 
        value: "offline" 
      },
    },
  ],
};

export const doctorOnboarding = {
  personalInfo: doctorPersonalInfoConfig,
  professionalInfo: doctorProfessionalInfoConfig,
  services: doctorServicesConfig,
};
