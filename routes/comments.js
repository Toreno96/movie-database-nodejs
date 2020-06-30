const express = require('express');
const router = express.Router();
const {body, validationResult, query} = require('express-validator');
const {moviesCollection, commentsCollection} = require('../database/database');

router.get('/', [
    query('movieId').optional(),
    query('failOnInvalidMovieId').optional().isBoolean()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const movieId = req.query.movieId
    if (!movieId) {
        const comments = commentsCollection.value();
        res.send(comments);
    }

    const failOnInvalidMovieId = req.query.failOnInvalidMovieId
        && ['true', 'yes', '1', 'on'].includes(req.query.failOnInvalidMovieId.toLowerCase());
    if (failOnInvalidMovieId) {
        const movie = moviesCollection.getById(movieId).value()
        if (!movie) {
            return res.status(404).json({details: `no movie with id=${movieId}`});
        }
    }

    const comments = commentsCollection.filter({movieId: movieId}).value()
    res.send(comments);
});

router.post('/', [
    body('movieId').exists(),
    body('text').exists()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const movie = moviesCollection.getById(req.body.movieId).value()
    if (!movie) {
        return res.status(404).json({details: `no movie with id=${req.body.movieId}`});
    }

    const {id} = commentsCollection.insert({movieId: req.body.movieId, text: req.body.text}).write();
    const comment = commentsCollection.getById(id).value();
    res.send(comment);
});

module.exports = router
