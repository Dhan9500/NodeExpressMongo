const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const allUser = await User.find();
    res.status(200).json({
        status: 'success',
        users: allUser,
    });
});
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'Fail',
        message: 'Service not implemented',
    });
};
exports.createNewUser = (req, res) => {
    res.status(500).json({
        status: 'Fail',
        message: 'Service not implemented',
    });
};
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'Fail',
        message: 'Service not implemented',
    });
};
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'Fail',
        message: 'Service not implemented',
    });
};
