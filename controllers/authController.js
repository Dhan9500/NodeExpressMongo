const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const generateAndSendSignToken = (user, statusCode, statusMessage, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(statusCode).json({
        status: statusMessage,
        token,
    });
};

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        changedPasswordAt: req.body.changedPasswordAt,
    });
    generateAndSendSignToken(newUser, 200, 'success', res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password.', 400));
    }
    const user = await User.findOne({ email: email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    generateAndSendSignToken(user, 200, 'login success', res);
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1. Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access!', 401));
    }
    // 2. Verification of token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // 3. Check if user still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }
    // 4. Check If User Changed Password after issued token.
    if (currentUser.changedPasswordAt && currentUser.checkChangedPasswordAt(decoded.iat)) {
        return next(new AppError('User recently changed password! Please login again', 401));
    }
    // Grant access to current user
    req.user = currentUser;
    next();
});

exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with email address.', 401));
    }
    // 2) Generate the random reste token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and password confirmation to: ${resetUrl}\nIf you didn't forget your password, please ignore this email!`;
    try {
        await sendEmail({
            email: req.body.email,
            subject: 'Your password reset token (Valid for 10 min)',
            message,
        });
        res.status(200).json({
            status: 'success',
            message: 'Token Sent On Mail',
        });
    } catch (err) {
        console.log(err);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('Something went wrong! Please try again later', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(new AppError('Token is invalid or has expired! Please try again.', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.changedPasswordAt = Date.now();
    await user.save();
    generateAndSendSignToken(user, 200, 'login success', res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from the database.
    const user = await User.findById(req.user._id).select('+password');
    // 2) Check the current password is correct or not
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Your current password is not correct! Please enter again', 401));
    }
    // 3) Set the new password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();
    generateAndSendSignToken(user, 200, 'login success', res);
});
