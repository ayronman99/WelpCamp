const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Review = require('../models/reviews');
const catchAsyncErr = require('../utils/catchAsyncErr');
const reviewController = require('../controllers/reviewController')
const { validateReview, isLoggedIn, isReviewAuthor, doSanitize } = require('../utils/securityware');

router.post('/', isLoggedIn, validateReview, reviewController.postReview)

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsyncErr(reviewController.deleteReview))

module.exports = router;