const express = require("express");
const multer = require('multer');
const authController = require('../controllers/authController');
const {
    getAllUsers,
    createUser,
    getUser,
    deleteUser,
    updateUser,
    updateMe,
    deleteMe,
    getMe,
    uploadPhoto,
    resizeUserPhoto
} = require('../controllers/usersController');


const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').post(authController.resetPassword);
// protect all route after this middleware
router.use(authController.protect);

router.route('/updatePassword').patch(authController.updatePassword)
router.route('/updateMe').patch(uploadPhoto, resizeUserPhoto, updateMe)
router.route('/me').get(getMe, getUser)
router.route('/deleteMe').delete(deleteMe)

router.use(authController.restrictTo('admin'))

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id')
  .get(getUser)
  .delete(deleteUser)
  .patch(updateUser);

module.exports = router;
