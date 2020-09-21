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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
const api_1 = require("../utils/api");
const utils_1 = require("../utils/utils");
const GuildConfig_1 = require("../database/schemas/GuildConfig");
exports.router.get('/guilds', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guilds = yield api_1.getBotGuilds();
    //const user = await User.findOne( { discordId: req.user.discordId } );
    if (req.user) {
        const userGuilds = yield api_1.getUserGuilds(req.user.discordId);
        const mutualGuilds = utils_1.getMutualGuilds(userGuilds, guilds);
        res.send(mutualGuilds);
    }
    else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
}));
exports.router.get('/guilds/:guildId/config', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { guildId } = req.params;
    const config = yield GuildConfig_1.guildConfigDb.findOne({ guildId });
    return config ? res.send(config) : res.status(404).send({ msg: 'Not found' });
}));
exports.router.get('/guilds/:guildId/roles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { guildId } = req.params;
    try {
        const roles = yield api_1.getGuildRoles(guildId);
        res.send(roles);
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ msg: "Internal Server Error" });
    }
}));
exports.router.put('/guilds/:guildId/roles/default', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { defaultRole } = req.body;
    if (!defaultRole)
        return res.status(400).send({ msg: "Bad Request" });
    const { guildId } = req.params;
    try {
        const update = yield GuildConfig_1.guildConfigDb.findOneAndUpdate({ guildId }, { defaultRole }, { new: true });
        return update ? res.send(update) : res.status(400).send({ msg: "Bad Request" });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
}));
exports.router.put('/guilds/:guildId/prefix', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prefix } = req.body;
    const { guildId } = req.params;
    if (!prefix)
        return res.status(400).send({ msg: "Prefix Required" });
    if (prefix.length > 5)
        return res.status(400).send({ msg: "Prefix max length 5" });
    const update = yield GuildConfig_1.guildConfigDb.findOneAndUpdate({ guildId }, { prefix }, { new: true });
    if (update) {
        return res.status(200).send(update);
    }
    else {
        return res.status(400).send({ msg: 'Could not find document' });
    }
}));
