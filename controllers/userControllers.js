const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filteredObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const allUser = await User.find();
    res.status(200).json({
        status: 'success',
        users: allUser,
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create Error if user posts password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError('This route is not for password update, Please use /updatepassword', 400),
        );
    }
    // 2) Filtered out unwanted field names that are not allowed to update.
    const filteredData = filteredObj(req.body, 'name', 'email');
    // 3) Update the user data
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredData, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
