const express = require('express');
const viewsControllers = require('../controllers/viewsController');
const router = express.Router();
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');



//ROUTES

router.get('/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsControllers.getOverview);

router.get(
  '/my-tours',
  bookingController.createBookingCheckout,
  authController.protect,
  viewsControllers.getMyTours
);

router.get('/tour/:slug', authController.isLoggedIn, viewsControllers.getTour);

router.get('/login', authController.isLoggedIn, viewsControllers.getLoginForm);

router.get('/me', authController.protect, viewsControllers.getAccount);



// router.post('/submit-user-data', authController.protect, viewsControllers.updateUserData)

module.exports = router;
