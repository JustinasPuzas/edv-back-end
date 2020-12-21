"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYoutubeVideoInfo = exports.updateMusicBot = exports.getUserGuilds = exports.getGuildChannels = exports.getGuildRoles = exports.getBotGuilds = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("../config");
const OAuth2Credentials_1 = require("../database/schemas/OAuth2Credentials");
const utils_1 = require("./utils");
const crypto_js_1 = __importDefault(require("crypto-js"));
const axios_1 = __importDefault(require("axios"));
const youtubeMusicDb_1 = require("../database/schemas/youtubeMusicDb");
const youtube_dl_1 = require("youtube-dl");
const DISCORD_API = 'http://discord.com/api/v6';
function getBotGuilds() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield node_fetch_1.default(`${DISCORD_API}/users/@me/guilds`, {
            method: 'GET',
            headers: {
                Authorization: `Bot ${config_1.config.token}`
            }
        });
        return response.json();
    });
}
exports.getBotGuilds = getBotGuilds;
function getGuildRoles(guildId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield node_fetch_1.default(`${DISCORD_API}/guilds/${guildId}/roles`, {
            method: 'GET',
            headers: {
                Authorization: `Bot ${config_1.config.token}`
            }
        });
        return response.json();
    });
}
exports.getGuildRoles = getGuildRoles;
function getGuildChannels(guildId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield node_fetch_1.default(`${DISCORD_API}/guilds/${guildId}/channels`, {
            method: 'GET',
            headers: {
                Authorization: `Bot ${config_1.config.token}`
            }
        });
        return yield response.json();
    });
}
exports.getGuildChannels = getGuildChannels;
function getUserGuilds(discordId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const credentials = yield OAuth2Credentials_1.OAuth2Credentials.findOne({ discordId });
            if (!credentials)
                throw new Error("No credentials");
            const encryptedAccessToken = credentials.get('accessToken');
            const decrypted = utils_1.decrypt(encryptedAccessToken);
            const accessToken = decrypted.toString(crypto_js_1.default.enc.Utf8);
            const response = yield node_fetch_1.default(`${DISCORD_API}/users/@me/guilds`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return yield response.json();
        }
        catch (err) {
            console.log(err);
            return null;
        }
    });
}
exports.getUserGuilds = getUserGuilds;
function updateMusicBot(guildId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.put(`${config_1.config.discordMusicEndUrl}/api/discord/config/music`, {
                guildId: guildId
            });
        }
        catch (err) {
            console.log(err);
            return null;
        }
    });
}
exports.updateMusicBot = updateMusicBot;
function getYoutubeVideoInfo(id, requestBy) {
    return __awaiter(this, void 0, void 0, function* () {
        const songInfoDoc = yield youtubeMusicDb_1.youtubeMusicDb.findOne({ id });
        if (songInfoDoc) {
            console.log(`FOUND VIDEO`);
            const songInfo = songInfoDoc;
            return {
                title: songInfo.title,
                link: songInfo.link,
                author: requestBy,
                thumbnail: songInfo.thumbnail,
            };
        }
        console.log(`SEARCHING VIDEO`);
        try {
            let info = yield promise(`https://youtu.be/${id}`);
            if (!info)
                return null;
            let song = {
                link: `https://youtu.be/${id}`,
                title: `${info.title}`,
                author: `${requestBy}`,
                thumbnail: `https://img.youtube.com/vi/${id}/0.jpg`
            };
            let songDb = {
                id: `${id}`,
                link: `https://youtu.be/${id}`,
                title: info.title,
                thumbnail: `https://img.youtube.com/vi/${id}/0.jpg`,
                duration: info._duration_raw,
                uploader: info.uploader,
                author: requestBy,
                type: 'MUSIC',
                downloaded: false,
            };
            console.log(songDb);
            yield youtubeMusicDb_1.youtubeMusicDb.create(songDb);
            return song;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    });
}
exports.getYoutubeVideoInfo = getYoutubeVideoInfo;
function promise(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            youtube_dl_1.getInfo(url, (err, info) => {
                if (err) {
                    reject(err);
                    throw err;
                }
                else {
                    resolve(info);
                }
            });
        });
    });
}
