const fs = require('fs');

const tours = JSON.parse(fs.readFileSync('../dev-data/data/tours-simple.json'));
module.exports = tours;
