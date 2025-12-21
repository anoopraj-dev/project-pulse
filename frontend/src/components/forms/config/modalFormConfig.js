export const emailInputConfig = {
    fields: [
        {name:'email',label:'Email',type:'email', required: true},
        {name:'role',label:'Role', type:'select',options:['patient','doctor'],required:true}
    ],
    buttonText:'Submit'
};


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
