import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        username: { type: String, required: true, unique: true, trim: true, lowercase: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true, minlength: 6 },
        profilePic: { type: String, default: '' },
        profilePicPublicId: { type: String, default: '' },
        bio: { type: String, default: '', maxlength: 150 },
        isOnline: { type: Boolean, default: false },
        lastSeen: { type: Date, default: Date.now },
        socketId: { type: String, default: '' },
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
    return {
        _id: this._id,
        fullName: this.fullName,
        username: this.username,
        email: this.email,
        profilePic: this.profilePic,
        bio: this.bio,
        isOnline: this.isOnline,
        lastSeen: this.lastSeen,
        createdAt: this.createdAt,
    };
};

const User = mongoose.model('User', userSchema);
export default User;