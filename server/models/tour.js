const mongoose = require('mongoose');

var TourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        minlength: 0,
    },
    price: {
        type: Number,
        minlength: 0,
    },
    guide: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guide',
        required: true
    },
    path: [
        {
            name: String,
            country: String,
        }
    ]
}, { timestamps: true });


const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour