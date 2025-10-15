export const emailInputConfig = {
    title:'Tell us who you are!',
    fields: [
        {name:'email',label:'Email',type:'email', required: true},
        {name:'role',label:'Role', type:'select',options:['patient','doctor'],required:true}
    ],
    buttonText:'Submit'
};


export const setPasswordFormConfig = {
  title: "Set Your New Password",
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
