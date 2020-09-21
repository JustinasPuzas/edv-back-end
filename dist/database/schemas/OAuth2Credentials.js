"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Credentials = void 0;
const mongoose_1 = require("mongoose");
exports.OAuth2Credentials = mongoose_1.model('OAuthCredentials', new mongoose_1.Schema({
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    discordId: {
        type: String,
        required: true,
    },
}));
