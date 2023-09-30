const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    }
});

module.exports = mongoose.model('Client', ClientSchema);


// mongoose schema is a blueprint of the database.
// It is not related to graphql schema.
// It is a layer of abstraction between the database and the application.
// The first layer is the database itself and the second layer is the mongoose schema and third layer is the graphql schema.