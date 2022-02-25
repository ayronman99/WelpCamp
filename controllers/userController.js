const User = require('../models/user');



module.exports.postReg = async (req, res, next) => {
    try {
     const {username, email, password} = req.body;
     const user = new User({username, email});
     const registeredUser = await User.register(user, password);
     req.login(registeredUser, err => {
         if(err) return next(err);
         req.flash('success', 'Welcome to Yelp Camp!')
         res.redirect('/campgrounds')
     })
    } catch(e) {
         if(e.code === 11000){
            req.flash('error', e.message = 'Oops, the email is already registered!')
            res.redirect('register');
        } else {
            
                req.flash('error', e.message );
                res.redirect('register')
            }
     }
    
 }


 module.exports.postLogin = (req, res) => {
    req.flash('success', 'Logged in!');
    const redirectURL = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo
    res.redirect(redirectURL)
}