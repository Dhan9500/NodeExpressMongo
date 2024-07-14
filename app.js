const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorHandler');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
/* Demo
app.get('/', (req, res) => {
  // res.status(200).send('Hello from the server');
  res.status(200).json({ message: 'Hello from the server', app: 'Natours' });
});
app.post('/', (req, res) => {
  res.send('You can post to this endpoint.....');
});
*/
// Strating the actual one from here..............
// 1) MIDDLEWARES
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
// app.use(express.static('./public'));
// Creating our own middle-ware: Note: Middle-ware order really matters.....
app.use((req, res, next) => {
    console.log('Hello from the middle-ware.....');
    next();
});

app.use((req, res, next) => {
    req.requestedTime = new Date().toISOString();
    next();
});

/*
app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', createNewTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);
*/
// 4) ROUTE
//Tours
/*
app.route('/api/v1/tours').get(getAllTours).post(createNewTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
//Users
app.route('/api/v1/users').get(getAllUsers).post(createNewUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
    .delete(deleteUser);
  */
// 6 Mounting routers as a middle ware
// const tourRouter = express.Router();
// const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Route handler if not match any of the router.....
app.all('*', (req, res, next) => {
    /*  res.status(404).json({
        status: 'failed',
        message: `Can't find ${req.originalUrl} on this server!`,
    });
    next();
    */
    // OR;
    /*const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.statusCode = 404;
    err.status = 'failed';
    next(err);*/
    //OR

    const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err);
});

// Error Middleware

app.use(globalErrorHandler);

//Tours
/*
tourRouter.route('/').get(getAllTours).post(createNewTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
*/
//Users
/*
userRouter.route('/').get(getAllUsers).post(createNewUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
*/

module.exports = app;
