const { cloudinary } = require('../cloudinary/cloudup')
const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken})




module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderForm = (req, res) => {
    res.render('campgrounds/new')    
}


module.exports.postCampForm = async (req, res, next) => {
    const geoData = 
        await geoCoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        }).send()

    const campgrounds = new Campground(req.body.campground);
    campgrounds.geometry = geoData.body.features[0].geometry;
    campgrounds.images = req.files.map(file => ({ url: file.path, filename: file.filename }))
    campgrounds.author = req.user._id;
    await campgrounds.save();
    req.flash('success', 'Successfully created the camp!')
    res.redirect(`/campgrounds/${campgrounds._id}`)
 }

module.exports.getCamp = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate(
        {
            path:'reviews',
            populate: {
                path: 'author'
            }
        }
    ).populate('author')
    if(!camp) {
        req.flash('error', 'Sorry camp does not exist :-(')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp })
}

module.exports.getEditCamp = async (req, res, next) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)
    if(!campgrounds) {
        req.flash('error', 'Sorry cannot edit, camp does not exist :-(')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campgrounds })
}

module.exports.postEditCamp = async (req, res, next) => {
    const { id } = req.params;
    const geoData = 
        await geoCoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        }).send()
    const updateCamp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    if (req.files.length > 0) {
        const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }))
        updateCamp.images.push(...imgs)
      }
    updateCamp.geometry = geoData.body.features[0].geometry;
    await updateCamp.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
          await  cloudinary.uploader.destroy(filename)
        }
        await updateCamp.updateOne({ $pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated the camp!')
    res.redirect(`/campgrounds/${updateCamp._id}`);
 }

 module.exports.deleteCamp = async (req, res, next) => {
    const { id } = req.params;
    const deleteCamp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted the camp successfully!')
    res.redirect('/campgrounds')
 }



 