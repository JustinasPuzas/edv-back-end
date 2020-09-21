import mongoose from 'mongoose';

export const User = mongoose.model('USer', new mongoose.Schema( {
    discordId: {
        type: String,
        required: true,
        unique: true,
    },
    discordTag: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    }
}));