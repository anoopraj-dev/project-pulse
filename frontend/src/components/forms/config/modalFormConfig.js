import { USER_STATUS_OPTIONS } from "../../../constants/homePageData";

// ---------------- EMAIL INPUT CONFIG ----------------
export const emailInputConfig = {
  fields: [
    { name: "email", label: "Email", type: "email", required: true },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: ["patient", "doctor"],
      required: true,
    },
  ],
  buttonText: "Submit",
};

// ---------------- SET PASSWORD CONFIG ----------------
export const setPasswordFormConfig = {
  fields: [
    {
      name: "newPassword",
      label: "New Password",
      type: "password",
      required: true,
      icon:'mdi-eye'
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      required: true,
      icon:'mdi-eye'
    },
  ],
  buttonText: "Update Password",
};

// ---------------- SEND MESSAGE/COMMENT CONFIG ----------------
export const sendCommentConfig = {
  fields: [
    { name: "reason", label: "Reason", type: "textarea", required: true },
  ],
};

// ---------------- UPDATE PROFILE PICTURE CONFIG ----------------
export const updateProfilePictureConfig = {
  fields: [
    {
      name: "profilePicture",
      label: "Choose a picture",
      type: "file",
    },
  ],
};

// ---------------- CERTIFICATE UPLOAD CONFIG ----------------

export const certificateUploadConfig = (closeModal) => ({
  fields: [
    // ---------------- CATEGORY ----------------
    {
      name: "certificateCategory",
      label: "Certificate Category",
      type: "select",
      required: true,
      options: ["Experience", "Education", "ID Proof"],
    },

    // ---------------- EXPERIENCE FILE ----------------
    {
      name: "experienceCertificate",
      label: "Upload Experience Certificate",
      type: "file",
      accept: "image/*,application/pdf",
      condition: {
        dependsOn: "certificateCategory",
        type: "equals",
        value: "Experience",
      },
    },

    // ---------------- EDUCATION FILE ----------------
    {
      name: "educationCertificate",
      label: "Upload Education Certificate",
      type: "file",
      accept: "image/*,application/pdf",
      condition: {
        dependsOn: "certificateCategory",
        type: "equals",
        value: "Education",
      },
    },

    // ---------------- ID PROOF FILE (MULTIPLE) ----------------
    {
      name: "proofDocument",
      label: "Upload ID Proof / License",
      type: "file",
      accept: "image/*,application/pdf",
      multiple: true,
      condition: {
        dependsOn: "certificateCategory",
        type: "equals",
        value: "ID Proof",
      },
    },

    // ---------------- EDUCATION FIELDS ----------------
    {
      name: "degree",
      label: "Degree",
      type: "text",
      condition: {
        dependsOn: "certificateCategory",
        type: "equals",
        value: "Education",
      },
    },
    {
      name: "college",
      label: "College Name",
      type: "text",
      condition: {
        dependsOn: "certificateCategory",
        type: "equals",
        value: "Education",
      },
    },
    {
      name: "completionYear",
      label: "Year of Completion",
      type: "text",
      condition: {
        dependsOn: "certificateCategory",
        type: "equals",
        value: "Education",
      },
    },

    // ---------------- EXPERIENCE FIELDS ----------------
    {
      name: "hospitalName",
      label: "Hospital Name",
      type: "text",
      condition: {
        dependsOn: "certificateCategory",
        type: "equals",
        value: "Experience",
      },
    },
    {
      name: "hospitalLocation",
      label: "Hospital Location",
      type: "text",
      condition: {
        dependsOn: "certificateCategory",
        type: "equals",
        value: "Experience",
      },
    },
    {
      name: "yearsOfExperience",
      label: "Years of Experience",
      type: "text",
      condition: {
        dependsOn: "certificateCategory",
        type: "equals",
        value: "Experience",
      },
    },

    // ---------------- ID PROOF / LICENSE FIELDS ----------------
    {
      name: "registrationNumber",
      label: "Registration Number",
      type: "text",
      condition: {
        dependsOn: "certificateCategory",
        type: "equals",
        value: "ID Proof",
      },
    },
    {
      name: "stateCouncil",
      label: "State Council",
      type: "text",
      condition: {
        dependsOn: "certificateCategory",
        type: "equals",
        value: "ID Proof",
      },
    },
    {
      name: "yearOfRegistration",
      label: "Year of Registration",
      type: "text",
      condition: {
        dependsOn: "certificateCategory",
        type: "equals",
        value: "ID Proof",
      },
    },
  ],
});

// ---------------- REVOKE STATUS CONFIG ----------------

export const revokeStatusConfig = {
  fields: [
    {
      name: "status",
      label: "Select New Status *",
      type: "select",
      options: ["approved", "rejected", "pending", "resubmit"],
      required: true,
    },
  ],
};

// ---------------- SET APPOINTMENT STATUS CONFIG ----------------

export const setAppointmentStatusConfig = {
  fields: [
    {
      name: "appointmentStatus",
      label: "Select Action",
      type: "select",
      options: ["confirm", "cancel", "re-schedule"],
      required: true,
    },
  ],
};
