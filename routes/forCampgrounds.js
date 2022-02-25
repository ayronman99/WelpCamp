const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const campController = require('../controllers/campController')
const catchAsyncErr = require('../utils/catchAsyncErr');
const { isLoggedIn, isAuthor, validateCampData } =  require('../utils/securityware');
const multer  = require('multer')
const { storage } = require('../cloudinary/cloudup')
const upload = multer({ storage })

router.route('/')
    .get(catchAsyncErr(campController.index))
    .post(isLoggedIn, upload.array('image'), validateCampData, catchAsyncErr(campController.postCampForm))
    


router.get('/new', isLoggedIn, campController.renderForm)


router.route('/:id')
    .get(catchAsyncErr(campController.getCamp))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampData, catchAsyncErr(campController.postEditCamp))
    .delete(isLoggedIn, isAuthor, catchAsyncErr(campController.deleteCamp))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsyncErr(campController.getEditCamp))



module.exports = router;