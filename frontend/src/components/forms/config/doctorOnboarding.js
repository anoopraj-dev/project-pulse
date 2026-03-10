const doctorPersonalInfoConfig = {
  title: "Personal Information",
  buttonText: "Next",
  fields: [
    {
      name: "dob",
      label: "Date of Birth *",
      type: "date",
      required: true,
      max: new Date().toISOString().split("T")[0],
      validation: {
        required: "Date of birth is required",
      },
    },
    {
      name: "gender",
      label: "Gender *",
      type: "radio",
      options: ["male", "female", "other"],
      required: true,
      validation: {
        required: "Gender is required",
      },
    },
    {
      name: "phone",
      label: "Phone *",
      type: "tel",
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
      name: "clinicName",
      label: "Clinic Name *",
      type: "text",
      required: true,
      placeholder: "Where you work/ own clinic",
    },
    {
      name: "clinicAddress",
      label: "Clinic Address *",
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
        pattern: /^[A-Z]{2,4}\d{4,6}$/i,
      },
      placeholder: "KLM1234",
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

    // upload certificates
    {
      name: "proofDocument",
      label: "Upload Any two valid IDs ( Adhaar/Driving License/ EID) *",
      type: "file",
      accept: "image/*,application/pdf",
      multiple: true,
      required: true,
      validation: {
        required: "Please upload ID documents",
        validate: (files) =>
          files?.length >= 2 || "Please upload at least two documents",
      },
    },

    {
      name: "qualifications",
      label: "Qualifications *",
      type: "textarea",
      required: true,
      placeholder: "Enter your qualifications",
      validation: {
        required: "Qualifications are required",
      },
    },
    {
      name: "specializations",
      label: "Specializations *",
      type: "textarea",
      required: true,
      placeholder: "Enter your specializations",
      validation: {
        required: "Specializations are required",
      },
    },

    // Experience Section (repeatable) - Add certificate upload
    {
      name: "experience",
      label: "Experience *",
      type: "repeatable",
      validation: {
        validate: (value) =>
          (value && value.length > 0) ||
          "At least one experience entry is required",
      },
      fields: [
        { name: "years", label: "Years", type: "number", required: true,validation: {
        required: "This field is required",
      }, },
        {
          name: "hospital",
          label: "Hospital Name",
          type: "text",
          required: true,
          validation: {
        required: "This field is required",
      }
        },
        { name: "location", label: "Location", type: "text", required: true ,validation: {
        required: "This field is required",
      }},
        {
          name: "experienceCertificate",
          label: "Upload Certificates",
          type: "file",
          accept: "image/*,application/pdf",
          multiple: false,
          required:true,
          validation: {
        required: "This field is required",
      }
        },
      ],
    },

    // Education Section (repeatable) - Add certificate upload
    {
      name: "education",
      label: "Education",
      type: "repeatable",
      validation: {
        validate: (value) =>
          (value && value.length > 0) ||
          "At least one education entry is required",
      },
      fields: [
        { name: "degree", label: "Degree", type: "text", required: true },
        {
          name: "college",
          label: "College Name",
          type: "text",
          required: true,
          validation: {
        required: "This field is required",
      }
        },
        {
          name: "completionYear",
          label: "Completion Year",
          type: "number",
          required: true,
          validation: {
        required: "This field is required",
      }
        },
        {
          name: "educationCertificate",
          label: "Upload Certificates",
          type: "file",
          multiple: false,
           accept: "image/*,application/pdf",
           required:true,
           validation: {
        required: "This field is required",
      }
        },
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
      label: "Services Offered *",
      type: "checkbox",
      options: ["online", "offline"],
      required: true,
      validation: {
        required: "This field is required",
      }
    },

    {
      name: "online_fee",
      label: "Online Fee",
      type: "number",
      placeholder: "₹0",
      min: 0,
      validation: {
        min: {
          value: 0,
          message: "Value cannot be negative",
        },
      },
      condition: {
        dependsOn: "services",
        type: "includes",
        value: "online",
      },
    },
    {
      name: "offline_fee",
      label: "Offline Fee",
      type: "number",
      placeholder: "₹0",
      min: 0,
      validation: {
        min: {
          value: 0,
          message: "Value cannot be negative",
        },
      },
      condition: {
        dependsOn: "services",
        type: "includes",
        value: "offline",
      },
    },
  ],
};

export const doctorOnboarding = {
  personalInfo: doctorPersonalInfoConfig,
  professionalInfo: doctorProfessionalInfoConfig,
  services: doctorServicesConfig,
};
