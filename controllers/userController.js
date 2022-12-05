const User = require("./../models/userModel");
const Post = require("./../models/postModel");
const handler = require("./handler");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/sendEmail");
const catchAsync = require("./../utils/catchAsync");

exports.createUser = handler.createOne(User);

exports.getUser = handler.getOne(User);

exports.getAllUsers = handler.getAll(User);

exports.deleteUser = handler.deleteOne(User);

exports.updateUser = handler.updateOne(User);

exports.blacklistUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    blacklisted: true,
    blacklistedBy: req.user.id,
  });

  if (!user) {
    return next(new AppError(`No Document find with id ${req.params.id}`, 404));
  }

  const docs = await Post.find({ user: user._id });

  docs.forEach(
    catchAsync(async (doc) => {
      await Post.findByIdAndUpdate(doc._id, {
        blacklisted: true,
        blacklistedBy: req.user.id,
      });
    })
  );

  const message = `You have been blacklisted by one of the admin members of our site.\n You can not access the restricted features of our site. \n`;

  try {
    await sendEmail({
      email: user.email,
      subject: "You are Blacklisted from the Chamber of Secrets",
      message,
    });
  } catch (err) {
    return next(new AppError("There was an error sending email"), 500);
  }

  res.status(200).json({
    status: "success",
    message:
      "User and All his posts successfully blacklisted\n E-mail sent to user regarding this.",
  });
});

exports.whitelistUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    blacklisted: false,
    blacklistedBy: null,
  });

  if (!user) {
    return next(new AppError(`No Document find with id ${req.params.id}`, 404));
  }

  const docs = await Post.find({ user: user._id });

  docs.forEach(
    catchAsync(async (doc) => {
      await Post.findByIdAndUpdate(doc._id, {
        blacklisted: false,
        blacklistedBy: null,
      });
    })
  );

  const message = `You have been whitelisted by one of the admin members of our site\n Now you can access the features of the site again.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Congratulations!!!! ",
      message,
    });
  } catch (err) {
    return next(new AppError("There was an error sending email"), 500);
  }

  res.status(200).json({
    status: "success",
    message:
      "User and All his posts successfully whitelisted\n E-mail sent to user regarding this.",
  });
});

exports.makeUserAdmin = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, blacklisted: { $ne: true } },
    {
      role: "admin",
    }
  );

  if (!user) return next(new AppError("No User found with this id", 404));

  res.status(200).json({
    status: "success",
    message: "Admin Added Successfully",
  });
});

exports.removeAdmin = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, blacklisted: { $ne: true } },
    {
      role: "user",
    }
  );

  if (!user) return next(new AppError("No User found with this id", 404));

  res.status(200).json({
    status: "success",
    message: "Admin Removed Successfully",
  });
});
