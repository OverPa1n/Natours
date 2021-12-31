const express = require("express");
const authController = require('../controllers/authController');
const {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan,
    getToursWithin,
    getDistances,
    uploadTourImages,
    resizeTourImages
} = require('../controllers/toursController');
const reviewRouter = require('./../routes/reviewsRoutes');
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/')
  .get(getAllTours)
  .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), createTour);
router.route('/top-5-cheap')
  .get(aliasTopTours, getAllTours);
router.route('/tour-stats')
  .get(getTourStats);
router.route('/monthly-plan/:year')
  .get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);
router.route('/:id')
  .get(
    authController.protect,
    getTourById)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour)
  .delete(authController.protect,authController.restrictTo('admin', 'lead-guide'),deleteTour);
router.route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin)
//  /tours-distance?distance=233,center=-40,45&unit=mi
router.route('/distances/:latlng/unit/:unit').get(getDistances)

module.exports = router;
