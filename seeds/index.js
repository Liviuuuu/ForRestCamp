const mongoose = require("mongoose");
const cities = require("./cities.js");
const { places, descriptors } = require("./seedHelpers.js");
const Campground = require("../models/campground");

mongoose.connect("mongodb://127.0.0.1:27017/forrestcamp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const randomCity = Math.floor(Math.random() * 1000);
    const newCampground = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      price: Math.floor(Math.random() * 100) + 1,
      location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
    });
    await newCampground.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
  console.log("Database disconnected");
});
