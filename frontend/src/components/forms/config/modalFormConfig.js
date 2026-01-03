
// -------------Email Input Config-------------
export const emailInputConfig = {
    fields: [
        {name:'email',label:'Email',type:'email', required: true},
        {name:'role',label:'Role', type:'select',options:['patient','doctor'],required:true}
    ],
    buttonText:'Submit'
};


//------------- Set Password Config ------------
export const setPasswordFormConfig = {
  fields: [
    {
      name: "newPassword",
      label: "New Password",
      type: "password",
      required: true,
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      required: true,
    },
  ],
  buttonText: "Update Password",
};

//------------------ Send Message/Comment config ------------------
export const sendCommentConfig = {
  fields:[
    {name:'rejectionReason',
      label: 'Reason',
      type: 'textarea',
      required: true
    }
  ]
}

//------------- Update Profile Picture config-------
export const updateProfilePictureConfig = {
  fields: [
    {
      name:'profilePicture',
      label:'Choose a picture',
      type: 'file',
    }
  ]
}



// ---------- Certificate upload config ----------

export const certificateUploadConfig = (closeModal) => ({
  fields: [
    // ---------- CATEGORY ----------
    {
      name: "certificateCategory",
      label: "Certificate Category",
      type: "select",
      required: true,
      options: ["Experience", "Education", "ID Proof"],
    },

    // ---------- EXPERIENCE FILE ----------
    {
      name: "experienceCertificate",
      label: "Upload Experience Certificate",
      type: "file",
      accept: "image/*,.pdf",
      condition: {
        dependsOn: "certificateCategory",
        type: "equals",
        value: "Experience",
      },
    },

    // ---------- EDUCATION FILE ----------
    {
      name: "educationCertificate",
      label: "Upload Education Certificate",
      type: "file",
      accept: "image/*,.pdf",
      condition: {
        dependsOn: "certificateCategory",
        type: "equals",
        value: "Education",
      },
    },

    // ---------- ID PROOF FILE (MULTIPLE) ----------
    {
      name: "proofDocument",
      label: "Upload ID Proof / License",
      type: "file",
      accept: "image/*,.pdf",
      multiple: true,
      condition: {
        dependsOn: "certificateCategory",
        type: "equals",
        value: "ID Proof",
      },
    },

    // ---------- EDUCATION FIELDS ----------
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

    // ---------- EXPERIENCE FIELDS ----------
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

    // ---------- ID PROOF / LICENSE FIELDS ----------
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
