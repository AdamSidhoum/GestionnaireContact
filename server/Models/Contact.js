const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name: { type: String, required: true},
    lastname: { type: String, required: true },
    imageUrl: { type: String, required: true },
    num: { type: String, required: true },
    userId: { type: String, required: true }

});

module.exports = mongoose.model('Contact', contactSchema);
