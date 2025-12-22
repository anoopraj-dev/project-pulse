export const doctorEditProfileConfig = {
  title: "Edit Profile",
  fields: [
    // ----------------------- Basic Information ------------------------
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

    { name: "location", label: "Location", type: "text" },

    {
      name: "about",
      label: "About",
      type: "textarea",
      placeholder: "Brief introduction about yourself",
    },

    // -------------------------Professional Information ---------------------
    {
      name: "professionalInfo",
      type: "title",
      title: "Professional Information",
    },

    { name: "professionalInfo.qualifications", label: "Qualifications", type: "text" },

    { name: "professionalInfo.specializations", label: "Specializations", type: "text" },

    // --------------------- Experience -------------------------
    { name: "experienceInfo", type: "title", title: "Experience" },

    { name: "professionalInfo.experience[0].years", label: "Years of Experience", type: "number" },

    { name: "professionalInfo.experience[0].hospitalName", label: "Hospital / Clinic Name", type: "text" },

    { name: "professionalInfo.experience[0].location", label: "Work Location", type: "text" },

   
    // ------------------------- Education ----------------------
    { name: "educationInfo", type: "title", title: "Education" },

    { name: "professionalInfo.education[0].degree", label: "Degree", type: "text" },

    { name: "professionalInfo.education[0].college", label: "College / University", type: "text" },

    { name: "professionalInfo.education[0].completionYear", label: "Year of Completion", type: "number" },

    

    // ------------------------- Medical License ---------------------------
    { name: "licenseInfo", type: "title", title: "Medical License" },

    { name: "professionalInfo.medicalLicense.registrationNumber", label: "Registration Number", type: "text" },

    {
      name: "professionalInfo.medicalLicense.stateCouncil",
      label: "State Medical Council",
      type: "select",
      options: [
        "Andhra Pradesh Medical Council (APMC)",
        "Delhi Medical Council (DMC)",
        "Karnataka Medical Council (KMC)",
        "Kerala State Medical Council (KSMC)",
        "Maharashtra Medical Council (MMC)",
        "Tamil Nadu Medical Council (TNMC)",
        "Telangana State Medical Council (TSMC)",
      ],
    },

    { name: "professionalInfo.medicalLicense.yearOfRegistration", label: "Year of Registration", type: "number" },


    // ---------------------- Services -------------------------------
{
  name: "servicesInfo",
  type: "title",
  title: "Services & Fees",
},

{
  name: "services[0].fees",
  label: "Online Consultation Fee",
  type: "number",
  placeholder: "Enter online consultation fee",
},

{
  name: "services[1].fees",
  label: "Offline Consultation Fee",
  type: "number",
  placeholder: "Enter offline consultation fee",
},


  ],
};
