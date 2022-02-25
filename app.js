if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// head up top ---------------------------------
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');


//Other NPMS
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrat = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const atlasDB = process.env.ATLAS_DB;


//ROUTES FOR MVC

const campRoutes = require('./routes/forCampgrounds');
const reviewRoutes = require('./routes/forReviews');
const userRoutes = require('./routes/forUsers');

//INITIATION MONGODB
const dbURL = atlasDB || 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbURL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error! Please Review!'));
db.once('open', () => {
    console.log('Success! Mongoose Connected!')
});

//------------------------MIDDLES---------------//
const app = express();
app.engine('ejs', ejsMate)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"))

//------------------APP.USESESES---------------//
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

const  secret = process.env.SECRET || 'hushsecretkeyis';


const hour = 3600000;
const sessionKey = {
    name: 'SesH',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + hour,
        maxAge: hour
    },
    store: new MongoStore({
        mongoUrl: dbURL,
        crypto: {
            secret
          },
        touchAfter: 86400
    })
}

app.use(session(sessionKey));
app.use(flash());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dv5vm4sqh/" ];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/dfahrc4rq/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);




//-------------------------PASSPORT---------------//

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrat(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//-------------------------ROUTERS---------------//

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})



app.use('/campgrounds', campRoutes);
app.use('/', userRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.get('/', (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
     next(new AppError('Page Not Found', 404))
 })

app.use((err, req, res, next) => {
    const { status = 500} = err;
    if(!err.message) err.message = "Something went wrong bwoi!" 
    res.status(status).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Opened port ${port}`)
})