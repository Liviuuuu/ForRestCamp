const mongoose = require("mongoose");
const cities = require("./cities.js");
const { places, descriptors } = require("./seedHelpers.js");
const Campground = require("../models/campground");
const Review = require("../models/review");

mongoose.connect("mongodb://127.0.0.1:27017/forrestcamp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});

  for (let i = 0; i < 400; i++) {
    const randomCity = Math.floor(Math.random() * 1000);
    const newCampground = new Campground({
      author: "6632b70a8990eb514a6ffbae",
      title: `${sample(descriptors)} ${sample(places)}`,
      price: Math.floor(Math.random() * 100) + 1,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium consequuntur placeat quasi velit soluta! A ducimus possimus dolores est, perferendis voluptatibus saepe error! Dolore assumenda minus ut quisquam. Esse, odit!",
      location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
      geometry: {
        type: "Point",
        coordinates: [cities[randomCity].longitude, cities[randomCity].latitude],
      },
      images: [
        {
          url: "https://res.cloudinary.com/ddfogyd0b/image/upload/v1714915904/ForRestCamp/lniwqoo9rt3zwxfwjpr9.jpg",
          filename: "ForRestCamp/lniwqoo9rt3zwxfwjpr9",
        },
        {
          url: "https://res.cloudinary.com/ddfogyd0b/image/upload/v1714915905/ForRestCamp/bh1rsgj5un3nfeoojuwu.jpg",
          filename: "ForRestCamp/bh1rsgj5un3nfeoojuwu",
        },
      ],
    });
    await newCampground.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
  console.log("Database disconnected");
});
