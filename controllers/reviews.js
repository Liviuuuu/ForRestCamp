const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate("reviews", "rating");
  const review = new Review(req.body.review);
  review.author = req.user._id;
  review.campground = req.params.id;
  campground.reviews.push(review);

  //overallRating
  let reviewsCnt = 0,
    reviewsRatingSum = 0;
  for (let review of campground.reviews) {
    reviewsRatingSum += review.rating;
    reviewsCnt++;
  }
  campground.overallRating = Math.round((reviewsRatingSum/reviewsCnt) * 10) / 10;

  await review.save();
  await campground.save();
  req.flash("success", "Successfully added your review!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  console.log(req);
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted your review!");
  res.redirect(`/campgrounds/${id}`);
};
