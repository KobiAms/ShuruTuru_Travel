const express = require('express')
const Tour = require('../models/tour')
const router = new express.Router()

// add new tour 
router.post('/tours', (req, res) => {
    // check if the Parameters received
    if (!req.body) {
        res.status(400);
        res.send("no params")
        return;
    }
    // create new tour from info received in request body
    const new_tour = new Tour(req.body)
    new_tour.save()
        .then(() => res.status(200).send('tour added successfuly'))
        .catch((error) => res.status(400).send(error))
});

// gets tours list
router.get('/tours', (req, res) => {
    Tour.find().populate('guide').then((tours) => {
        let toRet = {};
        tours.forEach(tour => {
            toRet[tour._id] = tour;
        });
        res.status(200).send(toRet)
    }).catch(res.status(500).send)
});

// get specific tour 
router.get('/tours/:tour_id', (req, res) => {
    // validate id received 
    if (!req.params.tour_id) {
        res.status(400);
        res.send("tour is not exists");
    }
    let tour_id = req.params.tour_id;
    Tour.find({ _id: tour_id }).populate('guide').then((tour) => {
        res.status(200).send(tour)
    }).catch(res.status(500).send)
});

// update tour details
router.put('/tours/:tour_id', (req, res) => {
    // check that all the data object received
    if (!(req.body && req.params.tour_id)) {
        res.status(400);
        res.send("no params")
        return;
    }
    Tour.findByIdAndUpdate(req.params.tour_id, req.body, (err) => {
        err ?
            res.status(500).send(err)
            :
            res.status(201).send("Tour Updated!");
    });
});

// add new site to tour_id path
router.put('/tours/:tour_id/site', (req, res) => {
    // check that all the params are received
    if (!(req.body && req.params.tour_id && req.body.name && req.body.country)) {
        res.status(400).send("no params")
        return;
    }
    var condition = {
        _id: req.params.tour_id,
        'path.name': { $ne: req.body.name }
    };
    var update = {
        $addToSet: { path: { name: req.body.name, country: req.body.country } }
    }
    Tour.findOneAndUpdate(condition, update, function (err, doc) {
        err ?
            res.status(500).send("Internal Server Error")
            :
            res.status(200).send("site added succesfully")
    });
});


// delete tour 
router.delete('/tours/:tour_id', (req, res) => {
    // validate params received
    let tour_id = req.params.tour_id;
    if (!tour_id) {
        res.status(400);
        res.send("no param");
        return;
    }
    // delete from DB
    Tour.find({ _id: tour_id }).deleteOne(function (err, doc) {
        err ?
            res.status(500).send("Internal Server Error")
            :
            res.status(200).send("tour deleted succesfully")
    });
});

// delete specific site in path of tour_id
router.delete('/tours/:tour_id/site/:name', (req, res) => {
    let { tour_id, name } = req.params;
    // validate params received
    if (!(tour_id && name)) {
        res.status(400);
        res.send("no params");
        return;
    }
    // if name is "" delete all the path
    if (name == "delete_all") {
        Tour.findByIdAndUpdate(
            tour_id, { $pull: { "path.name": name } },
            function (err) {
                err ?
                    res.status(500).send('site not deleted!')
                    :
                    res.status(200).send('site deleted!');
            });

    } else {
        Tour.findByIdAndUpdate(
            tour_id, { $pull: { path: { name: name } } },
            function (err) {
                err ?
                    res.status(500).send('site not deleted!')
                    :
                    res.status(200).send('site deleted!');
            });
    }

})

module.exports = router

