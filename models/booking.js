const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingsSchema = new Schema({
  checkIn: Date,
  checkOut: Date,
  campground: {
    type: Schema.Types.ObjectId,
    ref: "Campground",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  totalPrice: Number,
});

module.exports = mongoose.model("Booking", BookingsSchema);
