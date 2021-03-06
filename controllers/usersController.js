const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const extension = file.mimetype.split('/')[1];
//         const fileName = `user-${req.user.id}-${Date.now()}.${extension}`;
//         cb(null, fileName);
//     }
// })
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

const uploadPhoto = upload.single('photo');

const resizeUserPhoto = catchAsync(async (req,res,next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({quality: 90})
      .toFile(`public/img/users/${req.file.filename}`);

    next();
})

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};

    Object.keys(obj).forEach(field => {
        if (allowedFields.includes(field)) {
            newObj[field] = obj[field];
        }
    })

    return newObj;
}

const getMe = (req,res,next) => {
    req.params.id = req.user.id;
    next();
}


const createUser = (req,res) => {
    res.status(500).json({
        status: 'fail',
        message: 'This route is not defined! Please use sign-up instead'
    })
}
// Do NOT update password with updateUser controller
const updateUser = factory.updateOne(User);
const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);
const deleteUser = factory.deleteOne(User);

const updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
          new AppError(
            'This route is not for password updates. Please use /updateMyPassword.',
            400
          )
        );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

const deleteMe = catchAsync(async (req,res,next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false})

    res.status(204).json({
        status: 'success',
        data: null
    })
})


module.exports = {
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    createUser,
    updateMe,
    deleteMe,
    getMe,
    uploadPhoto,
    resizeUserPhoto
}
