const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../models/tourModel');
dotenv.config({ path: '../config.env' });
const db = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connection successful.'))
  .catch((err) => console.log(err));

// Reading the json file
const tours = JSON.parse(
  fs.readFileSync('../dev-data/data/tours-simple.json', 'utf-8'),
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Imported Successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Deleted Successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === 'import') {
  importData();
} else if (process.argv[2] === 'delete') {
  deleteData();
}
