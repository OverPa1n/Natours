const express = require('express');
const {getReviews, createReview, deleteReview, updateReview, setTourAndUserIds, getReview} = require('../controllers/reviewsController');
const authController = require('../controllers/authController');

const router = express.Router({mergeParams: true});

router.use(authController.protect)

router.route('/')
  .get(getReviews)
  .post(authController.restrictTo('user'), setTourAndUserIds, createReview)

router.route('/:id')
  .get(getReview)
  .delete(authController.restrictTo('user', 'admin'), deleteReview)
  .patch(authController.restrictTo('user', 'admin'), updateReview)
module.exports = router;

