const mongoose = require('mongoose');
const customerSchema = require('./schema');

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
