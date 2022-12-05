const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const QuerySelector = require("./../utils/querySelector");
const User = require("./../models/userModel");

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        newDoc,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new AppError("No user with this id", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(
        new AppError(`No Document find with id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: "success",
      message: "Document successfully updated",
      doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`No User find with id ${req.params.id}`, 404));
    }
    res.status(204).json({
      status: "success",
      message: "Document successfully deleted",
      doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (Model === User) filter = { verified: true, role: { $ne: "guest" } };

    // console.log(Model ==  )
    // if (Model === )
    let features = new QuerySelector(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .pagination();
    const docs = await features.query;

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        doc: docs,
      },
    });
  });

exports.blacklistOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, {
      blacklisted: true,
      blacklistedBy: req.user.id,
    });

    res.status(200).json({
      status: "success",
      message: "Document successfully blacklisted",
    });

    // next();
  });
