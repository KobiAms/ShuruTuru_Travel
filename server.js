const fs = require("fs");
const path = require("path");
const express = require('express');
require('./server/db/mongoose');
const tourRouter = require('./server/routes/tour');
const guideRouter = require('./server/routes/guide');
const app = express();
const port = 3001;

app.use('/add_tour', express.static(path.join(__dirname, 'app/html/add_tour.html')));
app.use('/list', express.static(path.join(__dirname, 'app/html/list.html')));
app.use('/add_guide', express.static(path.join(__dirname, 'app/html/add_guide.html')));
app.use('/js', express.static(path.join(__dirname, 'app/js')));
app.use('/assets', express.static(path.join(__dirname, 'app/assets')));
app.use('/styles', express.static(path.join(__dirname, 'app/styles')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(tourRouter)
app.use(guideRouter)


const server = app.listen(port, () => console.log('app is running on port %s...', server.address().port));