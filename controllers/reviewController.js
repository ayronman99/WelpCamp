const Campground = require('../models/campground');
const Review = require('../models/reviews');

module.exports.postReview = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
   await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
   await Review.findByIdAndDelete(reviewId)
   res.redirect(`/campgrounds/${id}`);
}