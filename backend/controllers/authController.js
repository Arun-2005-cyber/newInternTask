const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('../config/redis');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const register = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error)
            return res.status(400).json({ success: false, message: error.details[0].message });

        const { name, email, password, contact, userType, gender } = req.body;

        const existing = await User.findOne({ email });
        if (existing)
            return res.status(409).json({ success: false, message: 'Email already registered' });

        const hash = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hash,
            contact,
            userType,
            gender
        });

        res.status(201).json({ success: true, message: 'Registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error)
            return res.status(400).json({ success: false, message: error.details[0].message });

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // ✅ Redis cache
        await redis.set(`user:${user._id}`, JSON.stringify(user), { EX: 3600 });

        res.json({ success: true, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getProfile = async (req, res) => {
    try {
        const cached = await redis.get(`user:${req.userId}`);
        if (cached)
            return res.json({ success: true, user: JSON.parse(cached) });

        const user = await User.findById(req.userId).select('-password');
        if (!user)
            return res.status(404).json({ success: false, message: 'User not found' });

        await redis.set(`user:${req.userId}`, JSON.stringify(user), { EX: 3600 });

        res.json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { register, login, getProfile };
