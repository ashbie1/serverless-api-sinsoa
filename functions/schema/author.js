const mongoose = require('mongoose');
const { Schema } = mongoose;

const authorSchema = new Schema({
    artist: {
        type: String,
        required: true
    },
    song: {
        type: String,
        required: true
    },
    ratings: {
        type: Number,
        min: 1,
        max: 5
    }
});

module.exports = authorSchema; // Ensure the schema is being exported correctly
