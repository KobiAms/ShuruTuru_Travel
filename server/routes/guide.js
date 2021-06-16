const express = require('express')
const Guide = require('../models/guide')
const router = new express.Router()

// add new guide to DB 
router.post('/guides', (req, res) => {
    // check if the Parameters received
    if (!req.body) {
        res.status(400);
        res.send("no params")
        return;
    }
    // create new Guide from info received in request body
    const new_guide = new Guide(req.body)
    console.log(req.body)
    new_guide.save()
        .then(() => res.status(200).send('Guide added successfuly'))
        .catch((error) => res.status(400).send(error))
});

// gets tours list
router.get('/guides', (req, res) => {
    Guide.find().then((guides) => {
        res.status(200).send(guides)
    }).catch(res.status(500).send)
});

module.exports = router