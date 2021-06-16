const mongoose = require('mongoose');
const validator = require('validator')

var GuideSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    price: {
        type: Number,
        min: 0,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
    },
}, { timestamps: true });


const Guide = mongoose.model('Guide', GuideSchema);

module.exports = Guide