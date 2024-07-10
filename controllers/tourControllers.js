// const fs = require('fs');
// const tours = require('../fileReader/tourReader');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

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

// Alias middle ware-function

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

/*class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log(queryObj);
    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // 2) SORTING
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdBy');
    }
    return this;
  }

  fieldLimiting() {
    // 3) FIELD LIMITING
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    // 4) PAGINATION
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}*/

exports.getAllTours = async (req, res) => {
    // console.log(req.query);
    try {
        /* BUILD QUERY
    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    let query = Tour.find(JSON.parse(queryStr));

    // 2) SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdBy');
    }
    // 3) FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    // 4) PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }
    */
        // EXECUTE QUERY
        const apiFeatures = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .fieldLimiting()
            .pagination();
        const allTours = await apiFeatures.query;
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
