const User = require("./../models/userModel");
const Post = require("./../models/postModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/sendEmail");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.MY_SECRET);
};

const createToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    httpOnly: true,
  };
  // cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return next(new AppError("Please provide a valid email and password", 400));
  }

  const user = await User.findOne({ email: email, verified: true }).select(
    "+password"
  );

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid Email or Password", 401));
  }

  if (user.blacklisted) {
    return next(new AppError("You have been blacklisted by our admin", 403));
  }

  createToken(user, 200, res);
});

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const signToken = newUser.createSignUpToken();
  await newUser.save({ validateBeforeSave: false });

  const message = `You are just one Step to begin your fabulous journey on Chamber Of Secrets\n Paste the token in the dialog box on your website.\n This Code is valid for 10 mins\n \n ${signToken} `;

  try {
    await sendEmail({
      email: newUser.email,
      subject: "Your SignUp Confirmation Token {Valid for 10 min}",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to mail",
    });
  } catch (err) {
    newUser.signUpToken = undefined;
    newUser.signUpTokenExpires = undefined;
    await newUser.save({ validateBeforeSave: false });

    return next(new AppError("There was an error sending email", 500));
  }
});

exports.signUpConfirm = catchAsync(async (req, res, next) => {
  if (!req.body.token) return next(new AppError("Please Enter a Token", 400));

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");
  // console.log(hashedToken);
  const user = await User.findOne({
    signUpToken: hashedToken,
    signUpTokenExpires: { $gt: Date.now() },
    verified: false,
  });

  if (!user) {
    return next(new AppError("Token is invalid", 403));
  }

  user.verified = true;
  user.signUpToken = undefined;
  user.signupTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  createToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }
  //2 Verification token and
  const decoded = await promisify(jwt.verify)(token, process.env.MY_SECRET);
  //console.log(decoded);
  //3 check if user still exists
  const freshUser = await User.findOne({ _id: decoded.id, verified: true });
  if (!freshUser) {
    return next(new AppError("User not found", 401));
  }

  //4 check if user changed password after token was issued

  /*console.log(await freshUser.changedPasswordAfter(decoded.iat));
  if (await freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User changed password after token was issued: Please login again",
        401
      )
    );
  }*/

  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You are not authorized to this", 403));
    }
    next();
  };
};

exports.checkCorrectUser = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppError("No post with this id", 404));
  }

  //
  const check = req.user.id == post.user._id;
  // console.log(check);
  if (!check) {
    return next(
      new AppError(
        "You can not modify/delete this post, Only the user can modify/delete this post. Admins can blacklist it"
      )
    );
  }
  next();
});

exports.guestSession = catchAsync(async (req, res, next) => {
  const guest = await User.findOne({ name: "Guest" });
  createToken(guest, 200, res);
  // const guest = await User.collection.insertOne(user);
  // console.log(guest);
  // res.status(200).json({
  //   guest,
  // });
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    httpOnly: false,
  });
  res.status(200).json({ status: "success", message: "Logout successful" });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    role: { $ne: "guest" },
  });
  //console.log(user);
  if (!user) {
    return next(new AppError("No user with that email", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //Send it to user email
  //console.log(user);

  const message = `Forgot your password? \n Paste this Code on your screen and enter your New Password.\n If you didn't forget your password, please ignore this email!\n  ${resetToken} \n `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Token {Valid for 10 min}",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to mail",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("There was an error sending email"), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  createToken(user, 200, res);
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!user) return next(new AppError("No User found with this id", 404));

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Invalid Current Password", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});
