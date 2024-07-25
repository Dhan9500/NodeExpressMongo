const fs = require('fs');

const tours = JSON.parse(fs.readFileSync('../dev-data/data/tours.json'));
module.exports = tours;
