"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.youtubeLinkParse = exports.getGuildVoiceChannels = exports.getMutualGuilds = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const config_1 = require(".././config");
function getMutualGuilds(userGuilds, botGuilds) {
    //return userGuilds.filter((guild:any) => botGuilds.find((botGuild:any) => (botGuild.id === guild.id) && (guild.permissions & 0x20) === 0x20))
    const validGuilds = userGuilds.filter((guild) => (guild.permissions & 0x20) === 0x20);
    const included = [];
    const excluded = validGuilds.filter((guild) => {
        const findGuild = botGuilds.find((g) => g.id === guild.id);
        if (!findGuild)
            return guild;
        included.push(findGuild);
    });
    return { included, excluded };
}
exports.getMutualGuilds = getMutualGuilds;
function getGuildVoiceChannels(guildChannels) {
    const voiceChannels = guildChannels.filter((channel) => {
        if (channel.type == 2)
            return channel;
    });
    return voiceChannels;
}
exports.getGuildVoiceChannels = getGuildVoiceChannels;
function youtubeLinkParse(link) {
    if (link.startsWith(`https://www.youtube.com/watch?v=`)) {
        const coreLength = `https://www.youtube.com/watch?v=`.length;
        const videoId = link.substr(coreLength, 11);
        console.log(videoId, videoId.length);
        if (videoId.length != 11) {
            return;
        }
        return videoId;
    }
    else if (link.startsWith(`https://youtu.be/`)) {
        const coreLength = `https://youtu.be/`.length;
        const videoId = link.substr(coreLength, 11);
        console.log(videoId, videoId.length);
        if (videoId.length != 11) {
            return;
        }
        return videoId;
    }
    else {
        return;
    }
}
exports.youtubeLinkParse = youtubeLinkParse;
function encrypt(token) {
    return crypto_js_1.default.AES.encrypt(token, config_1.config.enKey);
}
exports.encrypt = encrypt;
function decrypt(token) {
    return crypto_js_1.default.AES.decrypt(token, config_1.config.enKey);
}
exports.decrypt = decrypt;
