const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    contact: { type: String },
    userType: { type: String, enum: ['student', 'professional'], default: 'student' },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
