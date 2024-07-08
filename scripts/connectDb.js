const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });
const mongoose = require('mongoose');
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
module.exports = mongoose;
