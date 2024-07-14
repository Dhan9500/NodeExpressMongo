const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: '../config.env' });
const db = process.env.DATABASE_URL.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(db).then(() => console.log('Database connection successful.'));
module.exports = mongoose;
