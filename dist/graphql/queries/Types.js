"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildConfigType = exports.UserType = exports.GuildRoleType = exports.MutualGuildType = void 0;
const graphql_1 = require("graphql");
const api_1 = require("../../utils/api");
//Discord Api Calls
exports.MutualGuildType = new graphql_1.GraphQLObjectType({
    name: 'MutualGuildType',
    fields: () => ({
        excluded: { type: new graphql_1.GraphQLList(GuildType) },
        included: { type: new graphql_1.GraphQLList(GuildType) }
    })
});
const GuildType = new graphql_1.GraphQLObjectType({
    name: 'GuildType',
    fields: () => ({
        id: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        icon: { type: graphql_1.GraphQLString },
        owner: { type: graphql_1.GraphQLBoolean },
        permissions: { type: graphql_1.GraphQLInt },
        features: { type: graphql_1.GraphQLList(graphql_1.GraphQLString) },
        permissions_new: { type: graphql_1.GraphQLString }
    })
});
exports.GuildRoleType = new graphql_1.GraphQLObjectType({
    name: 'GuildRoleType',
    fields: () => ({
        id: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        color: { type: graphql_1.GraphQLInt },
        hoist: { type: graphql_1.GraphQLBoolean },
        position: { type: graphql_1.GraphQLInt },
        permissions: { type: graphql_1.GraphQLInt },
        permissions_new: { type: graphql_1.GraphQLString },
        managed: { type: graphql_1.GraphQLBoolean },
        mentionable: { type: graphql_1.GraphQLBoolean },
    })
});
exports.UserType = new graphql_1.GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        discordTag: { type: graphql_1.GraphQLString },
        discordId: { type: graphql_1.GraphQLString },
        avatar: { type: graphql_1.GraphQLString },
        guilds: {
            type: new graphql_1.GraphQLList(GuildType),
            resolve(parent, args, request) {
                return request.user ? api_1.getUserGuilds(request.user.discordId) : null;
            }
        }
    })
});
//DataBaseCalls
//Guild Config
exports.GuildConfigType = new graphql_1.GraphQLObjectType({
    name: 'GuildConfigType',
    fields: () => ({
        guildId: { type: graphql_1.GraphQLString },
        prefix: { type: graphql_1.GraphQLString },
        defaultRole: { type: graphql_1.GraphQLString },
        silverCoins: { type: graphql_1.GraphQLInt },
        goldCoins: { type: graphql_1.GraphQLInt },
        silverLog: { type: graphql_1.GraphQLList(TransactionType) },
        goldLog: { type: graphql_1.GraphQLList(TransactionType) },
        modules: { type: graphql_1.GraphQLList(ModuleType) },
        voiceModule: { type: graphql_1.GraphQLList(VoiceModuleType) },
    })
});
const TransactionType = new graphql_1.GraphQLObjectType({
    name: 'TransactionType',
    fields: () => ({
        amount: { type: graphql_1.GraphQLInt },
        from: { type: graphql_1.GraphQLString },
        date: { type: graphql_1.GraphQLString },
        note: { type: graphql_1.GraphQLString },
    })
});
const ModuleType = new graphql_1.GraphQLObjectType({
    name: 'ModuleType',
    fields: () => ({
        moduleType: { type: graphql_1.GraphQLString },
        status: { type: graphql_1.GraphQLString },
        orderedOn: { type: graphql_1.GraphQLString },
        expires: { type: graphql_1.GraphQLString },
    })
});
const CategoryType = new graphql_1.GraphQLObjectType({
    name: 'CategoryType',
    fields: () => ({
        channelId: { type: graphql_1.GraphQLString },
        spawn: { type: graphql_1.GraphQLBoolean },
        listeners: { type: graphql_1.GraphQLList(graphql_1.GraphQLString) },
    })
});
const VoiceModuleType = new graphql_1.GraphQLObjectType({
    name: 'VoiceModuleType',
    fields: () => ({
        category: { type: graphql_1.GraphQLList(CategoryType) },
        moderatorRole: { type: graphql_1.GraphQLString },
        voiceBanRole: { type: graphql_1.GraphQLString },
    })
});
