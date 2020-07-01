const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const {moviesCollection} = require('../database/database');
const axios = require('axios');
const {omdbApiKey} = require('../config')

/* GET movies listing. */
router.get('/', (req, res) => {
    const movies = moviesCollection.value()
    res.send(movies);
});

/* GET movie by id */
router.get('/:movieId', (req, res) => {
    const movie = moviesCollection.getById(req.params.movieId).value()
    if (!movie) {
        return res.status(404).send();
    }
    res.send(movie);
});

/* POST new movie */
router.post('/', [body('title').exists()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const omdbRes = await axios.get('https://www.omdbapi.com', {
            params: {
                t: req.body.title,
                apikey: omdbApiKey,
            }
        });
        const foundMovie = omdbRes.data;
        if (foundMovie.Error) {
            return res.status(404).send();
        }

        const newMovie = moviesCollection.insert(foundMovie).write()
        const movie = moviesCollection.getById(newMovie.id).value()
        res.send(movie);
    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }
});

module.exports = router;
