const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');

/* GET movies listing. */
router.get('/', (req, res) => {
    res.send('respond with a resource');
});

/* POST new movie */
router.post('/', [body('title').exists()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    res.send(`movie '${req.body.title}' added`);
});

module.exports = router;
