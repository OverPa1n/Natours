const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

const setTourAndUserIds = (req,res,next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
}


const getReviews = factory.getAll(Review);
const getReview = factory.getOne(Review);
const createReview = factory.createOne(Review);
const deleteReview = factory.deleteOne(Review);
const updateReview = factory.updateOne(Review);

module.exports = {
  createReview,
  getReviews,
  deleteReview,
  updateReview,
  setTourAndUserIds,
  getReview
};
