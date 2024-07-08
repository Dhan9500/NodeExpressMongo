const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const connectDb = require('./scripts/connectDb');
const app = require('./app');

/*
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Park Camper',
  price: 398,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR 😒:', err);
  });
*/
app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(
    `Server is running at port ${process.env.PORT} on ${process.env.HOST}`,
  );
});
