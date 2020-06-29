const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const {moviesCollection} = require('../database/database')

/* GET movies listing. */
router.get('/', (req, res) => {
    const movies = moviesCollection.value()
    res.send(movies);
});

/* POST new movie */
router.post('/', [body('title').exists()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const newMovie = moviesCollection.insert({title: req.body.title}).write()
    const movie = moviesCollection.getById(newMovie.id).value()
    res.send(movie);
});

module.exports = router;
