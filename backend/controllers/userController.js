// backend/controllers/userController.js
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ name, email, password: hashedPassword });
        const token = createToken(newUser._id);

        res.status(201).json({
            success: true,
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = createToken(user._id);
        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('name email');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email || !validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Valid name and email are required" });
        }

        const emailInUse = await userModel.findOne({ email, _id: { $ne: req.user.id } });
        if (emailInUse) {
            return res.status(409).json({ success: false, message: "Email already in use by another user" });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true }
        ).select('name email');

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update Password
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword || newPassword.length < 8) {
            return res.status(400).json({ success: false, message: "Invalid password parameters" });
        }

        const user = await userModel.findById(req.user.id).select('+password');
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};