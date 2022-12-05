const mongoose = require("mongoose");
const User = require("./userModel");

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Post can not be empty"],
    },

    title: {
      type: String,
      default: "Demo",
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Post must belong to a user"],
    },

    blacklisted: {
      type: Boolean,
      default: false,
    },

    blacklistedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    upvotedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

    downvotedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual("upvotes").get(function () {
  return this.upvotedBy.length;
});

postSchema.virtual("downvotes").get(function () {
  return this.downvotedBy.length;
});

postSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

postSchema.pre(/^find/, function (next) {
  this.find({ user: { $ne: null } });
  next();
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
