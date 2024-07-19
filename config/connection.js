const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:3001/socialDB');

module.exports = mongoose.connection;