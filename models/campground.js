const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews')


const ImgSchema = new Schema({
    url: String,
    filename: String
})

ImgSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = {toJSON: {virtuals: true}}

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type:[Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    images: [ImgSchema]
}, opts);


CampgroundSchema.virtual('properties.popUpTitle').get(function() {
    return `<strong><a href="/campgrounds/${this.id}">${this.title}</a></strong>
    <p>${this.location}</p>
    <p>${this.description.substring(0, 50)}...</p>
    `
})

CampgroundSchema.post('findOneAndDelete', async function (camp) {
    if(camp.reviews.length){
      const res = await Review.deleteMany({ _id: {$in: camp.reviews }})
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)

