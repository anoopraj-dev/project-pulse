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

    {
      name: "professionalInfo.qualifications",
      label: "Qualifications",
      type: "text",
    },

    {
      name: "professionalInfo.specializations",
      label: "Specializations",
      type: "text",
    },

    // ---------------------- Services -------------------------------

    {
      name: "services",
      type: "title",
      title: "Services & Fee",
    },
    {
      name: "services[0].serviceType",
      type: "hidden",
      defaultValue: "online",
    },

    {
      name: "services[0].fees",
      label: "Online Consultation Fee",
      type: "number",
      placeholder: "Enter online consultation fee",
    },

    {
      name: "services[1].serviceType",
      type: "hidden",
      defaultValue: "offline",
    },

    {
      name: "services[1].fees",
      label: "Offline Consultation Fee",
      type: "number",
      placeholder: "Enter offline consultation fee",
    },
  ],
};
