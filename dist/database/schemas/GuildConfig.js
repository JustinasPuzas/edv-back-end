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
    guildShard: {
        type: String,
        required: false,
        unique: false
    },
    guildPort: {
        type: String,
        required: false,
        unique: false,
    },
    prefix: {
        type: String,
        required: true,
        default: "-lilu",
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
        type: Map,
        required: true,
        default: {}
    },
}));
