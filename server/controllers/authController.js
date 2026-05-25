import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { getCloudinary } from '../utils/cloudinaryConfig.js';


export const register = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        if (!fullName || !username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already taken' });
        }
        const user = new User({ fullName, username, email, password });
        await user.save();
        const token = generateToken(user._id, res);
        return res.status(201).json({ ...user.toPublicJSON(), token });
    } catch (error) {
        console.error('REGISTER ERROR:', error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = generateToken(user._id, res);
        return res.status(200).json({ ...user.toPublicJSON(), token });
    } catch (error) {
        console.error('LOGIN ERROR:', error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie('nexchat_token', '', { maxAge: 0 });
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('LOGOUT ERROR:', error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        return res.status(200).json(req.user.toPublicJSON());
    } catch (error) {
        console.error('GETME ERROR:', error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullName, bio, profilePic } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (fullName && fullName.trim()) user.fullName = fullName.trim();
        if (bio !== undefined) user.bio = bio;

        if (profilePic && profilePic.startsWith('data:image')) {
            try {
                const cld = getCloudinary();
                if (user.profilePicPublicId) {
                    await cld.uploader.destroy(user.profilePicPublicId);
                }
                const uploadResult = await cld.uploader.upload(profilePic, {
                    folder: 'nexchat/avatars',
                    transformation: [{ width: 300, height: 300, crop: 'fill' }],
                });
                user.profilePic = uploadResult.secure_url;
                user.profilePicPublicId = uploadResult.public_id;
            } catch (uploadError) {
                console.error('CLOUDINARY UPLOAD ERROR:', uploadError.message);
                return res.status(500).json({ message: 'Image upload failed: ' + uploadError.message });
            }
        }

        await user.save();
        return res.status(200).json(user.toPublicJSON());
    } catch (error) {
        console.error('UPDATE PROFILE ERROR:', error.message);
        return res.status(500).json({ message: error.message });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(200).json([]);
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { fullName: { $regex: query, $options: 'i' } },
            ],
            _id: { $ne: req.user._id },
        })
            .select('-password')
            .limit(10);
        return res.status(200).json(users);
    } catch (error) {
        console.error('SEARCH ERROR:', error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};