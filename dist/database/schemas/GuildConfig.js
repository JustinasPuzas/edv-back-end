"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guildConfigDb = void 0;
const mongoose_1 = require("mongoose");
exports.guildConfigDb = mongoose_1.model('GuildConfig', new mongoose_1.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    prefix: {
        type: String,
        required: true,
        default: "!",
    },
    defaultRole: {
        type: String,
        required: false,
    },
    silverCoins: {
        type: Number,
        required: true,
        default: 500,
    },
    goldCoins: {
        type: Number,
        required: true,
        default: 100,
    },
    silverLog: {
        type: Array,
        required: true,
        default: [{
                amount: 500,
                from: '',
                date: Date.now(),
                note: 'For Guild Creation from IGORIS#1569 uwu'
            }]
    },
    goldLog: {
        type: Array,
        required: true,
        default: [{
                amount: 100,
                from: '',
                date: Date.now(),
                note: 'For Guild Creation from IGORIS#1569 uwu'
            }]
    },
    modules: {
        type: Array,
        required: true,
        default: [{
                moduleType: 'VOICE',
                status: 'FREE',
                orderedOn: Date.now(),
                expires: Date.now() + 1,
            }]
    },
    voiceModule: {
        type: Array,
        required: false,
    },
    panelModule: {
        type: Array,
        required: false,
    },
    moderationModule: {
        type: Object,
        required: false,
    },
}));
