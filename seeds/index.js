const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const axios = require('axios');
const { response } = require('express');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error! Please Review!'));
db.once('open', () => {
    console.log('Success! Mongoose Connected!')
});

const tester = array => array[Math.floor(Math.random() * array.length)];

  

const seedDB = async() => {
    await Campground.deleteMany({});
    
    for(let i=0; i < 230; i++){
        const randomCamp = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            author: '62074d544624ff67ed4fcd25',
            title: `${tester(descriptors)} ${tester(places)}`,
            location: `${cities[randomCamp].city}, ${cities[randomCamp].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque quibusdam soluta laboriosam id culpa nihil quo rem atque commodi magnam, obcaecati veritatis dolores, natus minima est nesciunt? Ad, perspiciatis unde.',
            price: price,
            geometry:{
              type: 'Point',
              coordinates: [
                cities[randomCamp].longitude,
                cities[randomCamp].latitude
              ]
            },
            images: [
              {
                url: 'https://res.cloudinary.com/dfahrc4rq/image/upload/v1645156317/WelpCamp/jsebh64lgwk7x4jxjfka.jpg',
                filename: 'WelpCamp/jsebh64lgwk7x4jxjfka'
              },
              {
                url: 'https://res.cloudinary.com/dfahrc4rq/image/upload/v1645156317/WelpCamp/n9aiiqgpkxucxzbtuf76.jpg',
                filename: 'WelpCamp/n9aiiqgpkxucxzbtuf76'
              },
              {
                url: 'https://res.cloudinary.com/dfahrc4rq/image/upload/v1645156317/WelpCamp/ynpg4sxjnfdhtwf7vcsz.jpg',
                filename: 'WelpCamp/ynpg4sxjnfdhtwf7vcsz'
              },
              {
                url: 'https://res.cloudinary.com/dfahrc4rq/image/upload/v1645156317/WelpCamp/dfy9brelouq1x6h7iqln.jpg',
                filename: 'WelpCamp/dfy9brelouq1x6h7iqln'
              }
            ]  
        })
        await camp.save();
    }
}

seedDB().then(() =>{
    mongoose.connection.close();
});
