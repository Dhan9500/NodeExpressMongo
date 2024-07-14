/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // THIS ONLY WORKS ON CREATE AND SAVE
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password are not the same!',
        },
    },
    changedPasswordAt: Date,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.checkChangedPasswordAt = function (jwtIatTimeStamp) {
    const changedPasswordTime = parseInt(this.changedPasswordAt.getTime() / 1000, 10);
    return jwtIatTimeStamp < changedPasswordTime;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
