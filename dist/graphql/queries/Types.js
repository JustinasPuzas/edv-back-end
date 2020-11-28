"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongType = exports.ActivePlaylistType = exports.MusicModuleType = exports.GuildConfigType = exports.UserType = exports.Permission_OverWrite = exports.GuildChannelType = exports.GuildRoleType = exports.MutualGuildType = void 0;
const graphql_1 = require("graphql");
const api_1 = require("../../utils/api");
const graphql_type_json_1 = require("graphql-type-json");
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
exports.GuildChannelType = new graphql_1.GraphQLObjectType({
    name: 'GuildChannelType',
    fields: () => ({
        id: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        type: { type: graphql_1.GraphQLInt },
        topic: { type: graphql_1.GraphQLString },
        bitrate: { type: graphql_1.GraphQLInt },
        user_limit: { type: graphql_1.GraphQLInt },
        rate_limit_per_user: { type: graphql_1.GraphQLInt },
        position: { type: graphql_1.GraphQLInt },
        permission_overwrites: { type: graphql_1.GraphQLList(exports.Permission_OverWrite) },
        parent_id: { type: graphql_1.GraphQLString },
        nsfw: { type: graphql_1.GraphQLBoolean },
    })
});
exports.Permission_OverWrite = new graphql_1.GraphQLObjectType({
    name: 'Permission_OverWrite',
    fields: () => ({
        id: { type: graphql_1.GraphQLString },
        type: { type: graphql_1.GraphQLInt },
        allow: { type: graphql_1.GraphQLString },
        deny: { type: graphql_1.GraphQLString },
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
        guildShard: { type: graphql_1.GraphQLString },
        guildPort: { type: graphql_1.GraphQLString },
        prefix: { type: graphql_1.GraphQLString },
        defaultRole: { type: graphql_1.GraphQLString },
        silverCoins: { type: graphql_1.GraphQLInt },
        goldCoins: { type: graphql_1.GraphQLInt },
        silverLog: { type: graphql_1.GraphQLList(TransactionType) },
        goldLog: { type: graphql_1.GraphQLList(TransactionType) },
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
// const ModulesType = new GraphQLObjectType({
//     name: 'ModulesType',
//     fields: () => ({
//         modules: {type: GraphQLList(ModuleType)}
//     })
// })
exports.MusicModuleType = new graphql_1.GraphQLObjectType({
    name: 'ModuleType',
    fields: () => ({
        guildId: { type: graphql_1.GraphQLString },
        moduleType: { type: graphql_1.GraphQLString },
        on: { type: graphql_1.GraphQLBoolean },
        cost: { type: graphql_1.GraphQLInt },
        orderedOn: { type: graphql_1.GraphQLInt },
        expires: { type: graphql_1.GraphQLInt },
        //music Module
        prefix: { type: graphql_1.GraphQLString },
        status: { type: graphql_1.GraphQLString },
        djRole: { type: graphql_1.GraphQLString },
        defaultChannel: { type: graphql_1.GraphQLString },
        display: { type: graphql_1.GraphQLBoolean },
        shuffle: { type: graphql_1.GraphQLBoolean },
        activePlaylist: { type: exports.ActivePlaylistType },
        songs: { type: graphql_1.GraphQLList(exports.SongType) },
        savedPlaylists: { type: graphql_1.GraphQLList(PlaylistType) },
    })
});
exports.ActivePlaylistType = new graphql_1.GraphQLObjectType({
    name: 'ActivePlaylistType',
    fields: () => ({
        songs: { type: graphql_type_json_1.GraphQLJSONObject },
    })
});
const PlaylistType = new graphql_1.GraphQLObjectType({
    name: 'PlaylistType',
    fields: () => ({
        author: { type: graphql_1.GraphQLString },
        songs: { type: graphql_type_json_1.GraphQLJSONObject },
    })
});
exports.SongType = new graphql_1.GraphQLObjectType({
    name: 'SongType',
    fields: () => ({
        title: { type: graphql_1.GraphQLString },
        link: { type: graphql_1.GraphQLString },
        author: { type: graphql_1.GraphQLString },
        thumbnail: { type: graphql_1.GraphQLString },
    })
});
