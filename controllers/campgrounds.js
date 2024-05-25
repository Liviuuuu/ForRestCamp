const Campground = require("../models/campground");

const Fuse = require("fuse.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodeService = mbxGeocoding({ accessToken: mapBoxToken });

const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const queryStr = req.query;
  console.log("req.query:");
  console.log(req.query);
  if (req.query.search) {
    console.log("Intrare 1");
    console.log("req.query.campground(search):");
    console.log(req.query.campground);
    const campgroundsList = await Campground.find({});

    const fuse = new Fuse(campgroundsList, {
      minMatchCharLength: req.query.search.length,
      ignoreLocation: true,
      keys: ["title", "location"],
    });

    // const searchResults = fuse.search(req.query.search);
    // const campgrounds = searchResults.map((searchResult) => searchResult.item);
    const campgrounds = fuse.search(req.query.search).map((searchResult) => searchResult.item);

    res.render("campgrounds/index", { campgrounds, queryStr });
  } else if (Object.keys(req.query).length !== 0) {
    console.log("Intrare 2");
    console.log("req.query:");
    console.log(req.query);
    
    let queryObj = JSON.stringify(req.query);
    //price
    queryObj = queryObj.replace(/\b(gte|lte)\b/g, (match) => `$${match}`);
    //facilities
    queryObj = queryObj.replace(
      /\b(parking|wifi|petFriendly|nonStopCheckIn|nonSmokingRooms|EVChargingStation|kitchen|barbecue|campfire|swimmingPool|hotTub|coffeTeaMaker)\b/g,
      (match) => `facilities.${match}`
    );
    //roomFacilities
    queryObj = queryObj.replace(
      /\b(privateBathroom|refrigerator|TV|airConditioning|balcony|towels)\b/g,
      (match) => `roomFacilities.${match}`
    );
    //funThingsToDo
    queryObj = queryObj.replace(
      /\b(biking|ATV|motocross|fishing|canoeing|hiking|equestrian|climbing|rafting|walkingTours)\b/g,
      (match) => `funThingsToDo.${match}`
    );

    const queryString = JSON.parse(queryObj);
    console.log(queryObj);
    console.log(queryString);
    // console.log(await Campground.find({});
    // const campgrounds = await Campground.find({
    //   "facilities.parking": req.query.campground.facilities.parking,
    // });
    const campgrounds = await Campground.find(queryString);
    // const campgrounds = await Campground.find().where("parking").equals("true");
    console.log(queryStr.propertyType !== undefined)
    res.render("campgrounds/index", { campgrounds, queryStr });
  } else {
    console.log("Intrare 3");
    console.log(req.query);
    // const queryStr = req.query;
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds, queryStr });
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocodeService
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(req.body.campground);
  // console.log(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.author = req.user._id;
  await campground.save();
  // console.log(campground);
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");

  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
