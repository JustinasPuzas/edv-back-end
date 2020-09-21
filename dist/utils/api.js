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
exports.getUserGuilds = exports.getGuildRoles = exports.getBotGuilds = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("../config");
const OAuth2Credentials_1 = require("../database/schemas/OAuth2Credentials");
const utils_1 = require("./utils");
const crypto_js_1 = __importDefault(require("crypto-js"));
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
