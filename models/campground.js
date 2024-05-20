const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/image/upload", "/image/upload/b_black,c_auto_pad,g_auto,w_200,h_200");
});

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    overallRating: Number,
    propertyType: {
      type: String,
      enum: ["Camping", "Glamping", "Chalet", "Landowner Campsites"],
    },
    facilities: {
      type: [String],
      enum: [
        "Private Bathroom",
        "Air conditioning",
        "Kitchen",
        "Refrigerator",
        "Shower",
        "TV",
        "Towels",
        "Coffe/Tea maker",
      ],
    },
    roomFacilities: {
      type: [String],
      enum: [
        "Free Parking",
        "WiFi",
        "Pet friendly",
        "24h Check In",
        "Swimming pool",
        "Non-smoking room",
        "Electric vehicle chargin station",
        "Hot Tub",
      ],
    },
    funThingsToDo: {
      type: [String],
      enum: ["Bike rental", "Walking Tours"],
    },
    rules: {
      checkIn: {
        type: String,
      },
      checkOut: {
        type: String,
      },
      paymentMethods: {
        type: String,
      },
      quietHours: {
        type: String,
      },
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  opts
);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`;
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const result = await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
