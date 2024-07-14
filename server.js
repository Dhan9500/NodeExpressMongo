const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION..! 💥 Shutting down.....');
    console.log(err.name, err.message);
    process.exit(1);
});
const app = require('./app');

require('./scripts/connectDb');

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
const server = app.listen(8000, 'localhost', () => {
    console.log(`Server is running at port 8000 on localhost `);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION..! 💥 Shutting down.....');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
