"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const config_1 = require("../config");
exports.router = express_1.default.Router();
exports.router.get('/discord', passport_1.default.authenticate('discord'));
exports.router.get('/discord/redirect', passport_1.default.authenticate('discord'), (req, res) => {
    res.redirect(`${config_1.config.frontEndUrl}/menu`);
});
exports.router.get('/', (req, res) => {
    if (req.user) {
        res.send(req.user);
    }
    else {
        res.send(401);
    }
});
