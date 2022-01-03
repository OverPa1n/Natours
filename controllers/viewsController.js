const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req,res, next) => {
  // Get tour data from collection
  const tours = await Tour.find();
  // Build template

  // Render template using tour data from step 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  })
});

exports.getTour = catchAsync(async (req,res, next) => {
  const {slug} = req.params;
  const tour = await Tour.findOne({slug})
    .populate({
      path: 'reviews',
      fields: 'review name photo'
    })
    .populate({
      path: 'guides'
    })

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404))
  }

  res.status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour', {
    title: `${tour.name} tour`,
    tour
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

exports.getLoginForm = catchAsync(async (req,res) => {
  const {email, password} = req.body;

  res.status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://unpkg.com/axios/dist/axios.min.js ;base-uri"
      )
    .render('login', {
    title: 'Log into you account'
  })
})

exports.getSignupForm = catchAsync(async (req, res) => {
  res.status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://unpkg.com/axios/dist/axios.min.js ;base-uri"
    )
    .render('signup', {
      title: 'Sign up'
    })
})

exports.getAccount = (req,res) => {
  res.status(200).render('account', {
    title: 'Your account'
  })
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
