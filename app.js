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
    
    if (!bearerToken) {
        return res
            .status(401)
            .send('Unauthorized')
    };

    if (bearerToken.split(' ')[1] !== apiToken) {
        return res
            .status(401)
            .send('Unauthorized')
    }

    next();
    }
)

// Middleware for handling genre, country, avg_vote endpoints

// const handleGetBySearchOption = (req, res) => {
//     let searchResults = movies;

//     if (req.query.genre) {
//         searchResults = movies.filter(movie => movie[genre].toLowerCase().includes(req.query.genre.toLowerCase()));
//     }

//     if (req.query.country) {
//         searchResults = movies.filter(movie => movie[country].toLowerCase().includes(req.query.country.toLowerCase()));
//     }

//     if (req.query.avg_vote) {
//         searchResults = movies.filter(movie => Number(movie.avg_vote) >= Number(req.query.avg_vote));
//     }

//     res
//         .status(200)
//         .json(searchResults)

// }



// 1-for-all search options middleware, for use if adding more search options and created for the extra fun
// If adding more search options, inject into options array

const handleGetBySearchOption = (req, res) => {

    const options = ["genre", "country", "avg_vote"];
    const searchOption = Object.keys(req.query)[0];
    const searchKeyword = req.query[searchOption];

    if (!searchOption) {
        return res
            .status(200)
            .json(movies)
    };

    if (!options.includes(searchOption)) {
        return res
            .status(400)
            .send('Bad Request')
    };

    // Would it be better for this endpoint to return a 400 status?
    if (!searchKeyword) {
        return res
            .status(200)
            .json(movies)
    };

    if (!isNaN(Number(searchKeyword))) {
        const searchResults = movies.filter(movie => movie[searchOption] >= (Number(searchKeyword)))
        return res
            .status(200)
            .json(searchResults)  
    };

    const searchResults = movies.filter(movie => movie[searchOption].toLowerCase().includes(searchKeyword.toLowerCase()))
        res
            .status(200)
            .json(searchResults) 

};

app.get('/movie', handleGetBySearchOption);

app.listen(8000, () => {
    console.log(`Server is meowing on PORT 8000`)
});