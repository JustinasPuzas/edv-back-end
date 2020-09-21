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
const passport_1 = __importDefault(require("passport"));
const passport_discord_1 = __importDefault(require("passport-discord"));
const User_1 = require("../database/schemas/User");
const config_1 = require("../config");
const OAuth2Credentials_1 = require("../database/schemas/OAuth2Credentials");
const utils_1 = require("../utils/utils");
passport_1.default.serializeUser((user, done) => {
    done(null, user.discordId);
});
passport_1.default.deserializeUser((discordId, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findOne({ discordId });
        return user ? done(null, user) : done(null, null);
    }
    catch (err) {
        console.error(err);
        done(err, null);
    }
}));
passport_1.default.use(new passport_discord_1.default(config_1.config.clientInfo, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const encryptedAccessToken = utils_1.encrypt(accessToken).toString();
    const encryptedRefreshToken = utils_1.encrypt(refreshToken).toString();
    const { email, id, username, discriminator, avatar, guilds } = profile;
    try {
        const findUser = yield User_1.User.findOneAndUpdate({ discordId: id }, {
            discordTag: `${username}#${discriminator}`,
            avatar,
            email,
        }, { new: true });
        const findCredentials = yield OAuth2Credentials_1.OAuth2Credentials.findOneAndUpdate({ discordId: id }, {
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
        }, { new: true });
        if (findUser) {
            if (!findCredentials) {
                const newCredentials = yield OAuth2Credentials_1.OAuth2Credentials.create({
                    accessToken: encryptedAccessToken,
                    refreshToken: encryptedRefreshToken,
                    discordId: id,
                });
            }
            return done(null, findUser);
        }
        else {
            const newUser = User_1.User.create({
                discordId: id,
                discordTag: `${username}#${discriminator}`,
                avatar,
                email,
            });
            const newCredentials = yield OAuth2Credentials_1.OAuth2Credentials.create({
                accessToken: encryptedAccessToken,
                refreshToken: encryptedRefreshToken,
                discordId: id,
            });
            return done(null, newUser);
        }
    }
    catch (err) {
        console.error(err);
        return done(err, undefined);
    }
})));
