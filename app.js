require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const movies = require('./movie-data');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(validateBearerToken = (req, res, next) => {
    const bearerToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    
    if (!bearerToken || bearerToken.split(' ')[1] !== apiToken) {
        return res
            .status(401)
            .send('Unauthorized')
    };

    next();
    }
)

// Simple middleware for handling genre, country, avg_vote endpoints

// const handleGetBySearchOption = (req, res) => {
//     let results = movies;

//     if (req.query.genre) {
//         results = results.filter(result => result[genre].toLowerCase().includes(req.query.genre.toLowerCase()));
//     }

//     if (req.query.country) {
//         results = results.filter(result => result[country].toLowerCase().includes(req.query.country.toLowerCase()));
//     }

//     if (req.query.avg_vote) {
//         results = results.filter(result => Number(result.avg_vote) >= Number(req.query.avg_vote));
//     }

//     res.json(results)
// }

// 1-for-all search options middleware, for use if adding more search options and created for the extra fun
// If adding more search options, inject into options array

// const handleGetBySearchOption = (req, res) => {

//     const options = ["genre", "country", "avg_vote"];
//     const searchOption = Object.keys(req.query)[0];
//     const searchKeyword = req.query[searchOption];

//     if (!searchOption) {
//         return res.json(movies)
//     };

//     if (!options.includes(searchOption)) {
//         return res.send('Bad Request')
//     };

//     // Would it be better for this endpoint to return a 400 status?
//     if (!searchKeyword) {
//         return res.json(movies)
//     };

//     if (!isNaN(Number(searchKeyword))) {
//         const searchResults = movies.filter(movie => movie[searchOption] >= (Number(searchKeyword)))
//         return res.json(searchResults)  
//     };

//     const searchResults = movies.filter(movie => movie[searchOption].toLowerCase().includes(searchKeyword.toLowerCase()))
//         res.json(searchResults) 
// };

// Improved 1-for-all middleware
// Complete implementation of Mike Stowe's pseudocode

const handleGetBySearchOption = (req, res) => {
    let results = movies;
    const options = Object.keys(movies[0]);
    
    if(Object.keys(req.query).length === 0) {
        return res.json(movies)
    }

    for (let key in req.query) {
        if (options.includes(key)) {
            if (!isNaN(Number(req.query[key]))) {
                results = results.filter(result => result[key] >= Number(req.query[key]));
            } else {
                results = results.filter(results => results[key].toLowerCase() === req.query[key].toLowerCase())
            }
        } else {
            return res.status(400).send('Invalid request')
        }
    }

    return res.json(results)
};

app.get('/movie', handleGetBySearchOption);

app.listen(8000, () => {
    console.log(`Server is meowing on PORT 8000`)
});