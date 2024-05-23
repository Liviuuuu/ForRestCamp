const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    description: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    propertyType: Joi.string().escapeHTML(),
    facilities: Joi.object({
      parking: Joi.boolean(),
      wifi: Joi.boolean(),
      petFriendly: Joi.boolean(),
      nonStopCheckIn: Joi.boolean(),
      nonSmokingRooms: Joi.boolean(),
      EVChargingStation: Joi.boolean(),
      kitchen: Joi.boolean(),
      barbecue: Joi.boolean(),
      campfire: Joi.boolean(),
      swimmingPool: Joi.boolean(),
      hotTub: Joi.boolean(),
      coffeTeaMaker: Joi.boolean(),
    }),
    roomFacilities: Joi.object({
      privateBathroom: Joi.boolean(),
      refrigerator: Joi.boolean(),
      TV: Joi.boolean(),
      airConditioning: Joi.boolean(),
      balcony: Joi.boolean(),
      towels: Joi.boolean(),
    }),
    funThingsToDo: Joi.object({
      biking: Joi.boolean(),
      ATV: Joi.boolean(),
      motocross: Joi.boolean(),
      fishing: Joi.boolean(),
      canoeing: Joi.boolean(),
      hiking: Joi.boolean(),
      equestrian: Joi.boolean(),
      climbing: Joi.boolean(),
      rafting: Joi.boolean(),
      walkingTours: Joi.boolean(),
    }),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
