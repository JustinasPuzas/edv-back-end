"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.getMutualGuilds = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
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
function encrypt(token) {
    return crypto_js_1.default.AES.encrypt(token, "test");
}
exports.encrypt = encrypt;
function decrypt(token) {
    return crypto_js_1.default.AES.decrypt(token, "test");
}
exports.decrypt = decrypt;
