// const fs = require('fs');
// const tours = require('../fileReader/tourReader');
const Tour = require('../models/tourModel');

/* CheckId Middleware function

exports.checkId = (req, res, next, val) => {
  console.log(`Tour Id is ${val}`);
  const tour = tours.find((item) => item.id === req.params.id * 1);
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }
  next();
};
*/
/* CheckBody Middleware function..
exports.checkBody = (req, res, next) => {
  console.log('Middle ware chaining');
  const reqBody = req.body;
  if (!('name' in reqBody && 'price' in reqBody)) {
    return res.status(400).json({
      status: 'Bad Request',
      message: 'Either name or price is not available in body',
    });
  }
  next();
}; // Body check for incoming create requests
*/

/* File based controllers
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const tour = tours.find((item) => item.id === req.params.id * 1);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedTime,
    tour,
  });
};

exports.createNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return console.log(err);
      }
      res.status(201).json({
        status: 'success',
        createdAt: req.requestedTime,
        data: {
          tour: newTour,
        },
      });
    },
  );
};

exports.updateTour = (req, res) => {
  console.log(req.body);
  console.log(req.params);
  let tour = tours.find((item) => item.id === req.params.id * 1);
  tour = { ...tour, duration: req.body.duration };
  const updatedTours = tours.map((item) =>
    item.id === req.params.id * 1 ? tour : item,
  );
  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(updatedTours),
    (err) => {
      if (err) {
        return console.log(err);
      }
      res.status(200).json({
        status: 'success',
        updatedAt: req.requestedTime,
        tour,
      });
    },
  );
};

exports.deleteTour = (req, res) => {
  console.log(req.params);
  const updatedTours = tours.filter((item) => item.id !== req.params.id * 1);
  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(updatedTours),
    (err) => {
      if (err) {
        return console.log(err);
      }
      res.status(204).json({
        status: 'success',
        deletedAt: req.requestedTime,
        tour: null,
      });
    },
  );
};
*/

// Handlers by using Hosted Mongo DB.

exports.getAllTours = async (req, res) => {
  console.log(req.query);
  try {
    const allTours = await Tour.find(req.query);
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestedTime,
      results: allTours.length,
      data: {
        tours: allTours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tourById = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestedTime,
      tour: tourById === null ? 'Invalid Id' : tourById,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.createNewTour = async (req, res) => {
  /*
  const newTour = new Tour({});
  newTour.save().then((doc) => console.log(doc));
  */
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      createdAt: req.requestedTime,
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: updateTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      deletedAt: req.requestedTime,
      tour: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};
