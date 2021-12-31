const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const toursRoutes = require('./routes/toursRoutes');
const usersRoutes = require('./routes/usersRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const viewRouter = require('./routes/viewRoutes');
const cookieParser = require('cookie-parser');

app.set('view engine', 'pug');
// Middleware that Serving static files
app.set('views', path.join(__dirname, 'views'))

//MIDDLEWARES
// Security HTTP headers
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'", 'data:', 'blob:'],
        fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: ["'self'", 'unsafe-inline'],
        scriptSrc: ["'self'", 'https://*.cloudflare.com'],
        scriptSrcElem: ["'self'",'https:', 'https://*.cloudflare.com'],
        styleSrc: ["'self'", 'https:', 'unsafe-inline'],
        connectSrc: ["'self'", 'data', 'https://*.cloudflare.com']
    },
}))

// Development logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
// Limit request from same api
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this api, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from the body and req.body
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
      'duration', 'ratingsAverage', 'ratingsQuantity','maxGroupSize','difficulty'
    ]
}));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Test middleware
app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    next()
});

app.use('/', viewRouter)
app.use('/api/v1/tours', toursRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req,res,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
})

app.use(globalErrorHandler);

module.exports = app;
