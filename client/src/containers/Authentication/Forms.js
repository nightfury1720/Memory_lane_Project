export const Login = {
  email: {
    elementType: "input",
    elementConfig: {
      type: "email",
      id: "Login",
      placeholder: "Your Email",
    },
    value: null,
    icon: "email",
    validation: {
      required: true,
      isEmail: true,
    },
    valid: false,
    touched: false,
  },

  password: {
    elementType: "input",
    elementConfig: {
      type: "password",
      placeholder: "Your Password",
      id: "LoginPass",
    },
    value: null,
    icon: "lock",
    validation: {
      required: true,
      minLength: 8,
    },
    valid: false,
    touched: false,
  },
};

export const SignUp = {
  name: {
    elementType: "input",
    elementConfig: {
      type: "text",
      id: "SignUpName",
      placeholder: "Your Name",
    },
    value: null,
    icon: "user",
    validation: {
      required: true,
      minLength: 4,
    },
    valid: false,
    touched: false,
  },

  email: {
    elementType: "input",
    elementConfig: {
      type: "email",
      id: "SignUp",
      placeholder: "Your Email",
    },
    value: null,
    icon: "email",
    validation: {
      required: true,
      isEmail: true,
    },
    valid: false,
    touched: false,
  },

  password: {
    elementType: "input",
    elementConfig: {
      type: "password",
      placeholder: "Your Password",
      id: "SignUpPass",
    },
    value: null,
    icon: "lock",
    validation: {
      required: true,
      minLength: 8,
    },
    valid: false,
    touched: false,
  },

  passwordConfirm: {
    elementType: "input",
    elementConfig: {
      type: "password",
      placeholder: "Confirm Your Password",
      id: "SignUpPassConfirm",
    },
    value: null,
    icon: "lockFill",
    validation: {
      required: true,
      minLength: 8,
    },
    valid: false,
    touched: false,
  },
};

export const SignUpConfirm = {
  token: {
    elementType: "input",
    elementConfig: {
      type: "text",
      id: "SignUpConfirm",
      placeholder: "Paste the Token Here",
    },
    value: null,
    icon: "key",
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
  },
};

export const ForgotPass = {
  email: {
    elementType: "input",
    elementConfig: {
      type: "email",
      id: "ForgotEmail",
      placeholder: "Your Email",
    },
    value: null,
    icon: "email",
    validation: {
      required: true,
      isEmail: true,
    },
    valid: false,
    touched: false,
  },
};

export const ResetPassword = {
  token: {
    elementType: "input",
    elementConfig: {
      type: "text",
      id: "PassCheck",
      placeholder: "Paste the Token Here",
    },
    value: null,
    icon: "key",
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
  },

  password: {
    elementType: "input",
    elementConfig: {
      type: "password",
      placeholder: "Your Password",
      id: "SignUpPass",
    },
    value: null,
    icon: "lock",
    validation: {
      required: true,
      minLength: 8,
    },
    valid: false,
    touched: false,
  },

  passwordConfirm: {
    elementType: "input",
    elementConfig: {
      type: "password",
      placeholder: "Confirm Your Password",
      id: "SignUpPassConfirm",
    },
    value: null,
    icon: "lockFill",
    validation: {
      required: true,
      minLength: 8,
      same: true,
    },
    valid: false,
    touched: false,
  },
};

export const newPost = {
  title: {
    elementType: "input",
    elementConfig: {
      type: "text",
      id: "PostTitle",
      placeholder: "Post Title",
    },
    value: null,
  },

  text: {
    elementType: "textarea",
    elementConfig: {
      id: "PostData",
      placeholder: "Start Writing Here",
    },
    value: null,
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
  },
};

export const ChangePassword = {
  currentPassword: {
    elementType: "input",
    elementConfig: {
      type: "password",
      placeholder: "Your Current Password",
      id: "SignUpPass",
    },
    value: null,
    icon: "lock",
    validation: {
      required: true,
      minLength: 8,
    },
    valid: false,
    touched: false,
  },

  password: {
    elementType: "input",
    elementConfig: {
      type: "password",
      placeholder: "Your Password",
      id: "SignUpPass",
    },
    value: null,
    icon: "lock",
    validation: {
      required: true,
      minLength: 8,
    },
    valid: false,
    touched: false,
  },

  passwordConfirm: {
    elementType: "input",
    elementConfig: {
      type: "password",
      placeholder: "Confirm Your Password",
      id: "SignUpPassConfirm",
    },
    value: null,
    icon: "lockFill",
    validation: {
      required: true,
      minLength: 8,
      same: true,
    },
    valid: false,
    touched: false,
  },
};

// console.log(SignUp);
