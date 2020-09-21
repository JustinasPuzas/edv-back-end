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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootSchema = void 0;
const graphql_1 = require("graphql");
const api_1 = require("../utils/api");
const utils_1 = require("../utils/utils");
const GuildConfig_1 = require("../database/schemas/GuildConfig");
const Types_1 = require("./queries/Types");
const MutationQuery = new graphql_1.GraphQLObjectType({
    name: 'RootMutationQuery',
    fields: {
        updateGuildPrefix: {
            type: Types_1.GuildConfigType,
            args: {
                guildId: { type: graphql_1.GraphQLString },
                prefix: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { guildId, prefix } = args;
                    if (!guildId || !prefix || !request.user)
                        return null;
                    const config = yield GuildConfig_1.guildConfigDb.findOneAndUpdate({ guildId }, { prefix }, { new: true });
                    return config ? config : null;
                });
            },
        },
        updateDefaultRole: {
            type: Types_1.GuildConfigType,
            args: {
                guildId: { type: graphql_1.GraphQLString },
                defaultRole: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { guildId, defaultRole } = args;
                    if (!guildId || !defaultRole || !request.user)
                        return null;
                    const config = yield GuildConfig_1.guildConfigDb.findOneAndUpdate({ guildId }, { defaultRole }, { new: true });
                    return config ? config : null;
                });
            }
        }
    }
});
const RootQuery = new graphql_1.GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        getUser: {
            type: Types_1.UserType,
            resolve(parent, args, request) {
                return request.user ? request.user : null;
            }
        },
        getMutualGuilds: {
            type: Types_1.MutualGuildType,
            resolve(parent, args, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (request.user) {
                        const userGuilds = yield api_1.getUserGuilds(request.user.discordId);
                        const botGuilds = yield api_1.getBotGuilds();
                        return utils_1.getMutualGuilds(userGuilds, botGuilds);
                    }
                    return null;
                });
            }
        },
        getGuildConfig: {
            type: Types_1.GuildConfigType,
            args: {
                guildId: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { guildId } = args;
                    if (!guildId || !request.user)
                        return null;
                    const config = yield GuildConfig_1.guildConfigDb.findOne({ guildId });
                    return config ? config : null;
                });
            }
        },
        getGuildRoles: {
            type: new graphql_1.GraphQLList(Types_1.GuildRoleType),
            args: {
                guildId: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { guildId } = args;
                    if (!guildId || !request.user)
                        return null;
                    return api_1.getGuildRoles(guildId);
                });
            }
        }
    }
});
exports.RootSchema = new graphql_1.GraphQLSchema({ query: RootQuery, mutation: MutationQuery });
