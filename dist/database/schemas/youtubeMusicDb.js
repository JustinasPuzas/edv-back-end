"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.youtubeMusicDb = void 0;
const mongoose_1 = require("mongoose");
exports.youtubeMusicDb = mongoose_1.model('youtubeMusicDb', new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    thumbnail: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
    },
    uploader: {
        type: String,
        required: false,
    },
    author: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: false,
    },
    downloaded: {
        type: Boolean,
        required: true
    }
}));
