const mongoose = require("mongoose");
const Campground = require("./campground");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    body: String,
    rating: Number,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    campground: {
      type: Schema.Types.ObjectId,
      ref: "Campground",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
