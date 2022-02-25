const Campground = require('../models/campground');
const Review = require('../models/reviews');
const { campValidatorSchema, reviewSchema } = require('./schemas');
const AppError = require('./AppError');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
            req.session.returnTo = req.originalUrl
            req.flash('error', 'Please sign in first!');
            return res.redirect('/login')
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    if(!campgrounds.author.equals(req.user._id)) {
        req.flash('error', "Sorry, you don't have the clearance level to do that.")
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


module.exports.validateCampData = (req, res, next) => {
  
    const { error } = campValidatorSchema.validate(req.body);
    if(error){
        const msg = error.details.map(items => items.message).join(', ')
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(items => items.message).join(', ')
        req.flash('error', msg)
    } 
    next(); 
}




module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', "Sorry, you don't have the clearance level to do that.")
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
