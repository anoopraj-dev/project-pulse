
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


//------------- Update Profile Picture config-------
export const updateProfilePictureConfig = {
  fields: [
    {
      name:'profilePicture',
      label:'Choose a picture',
      type: 'file',
      uploadButton: true
    }
  ]
}

//---------- Certificate upload config --------------

export const certificateUploadConfig = (closeModal) => ({
  fields: [
    {
      name: "certificateCategory",
      label: "Certificate Category",
      type: "select",
      required: true,
      options: ["Experience", "Education", "ID Proof"],
    },
    {
      name: "file",
      label: "Upload Certificate",
      type: "file",
      uploadButton: true,
      accept: "image/*,.pdf",

      uploadPathFrom: "certificateCategory",
      uploadPathMap: {
        Experience: "experienceCertificate",
        Education: "educationCertificate",
        "ID Proof": "proofDocument",
      },

      onUploadComplete: closeModal,
    },
  ],
});


