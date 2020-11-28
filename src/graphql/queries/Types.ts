import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLInt, GraphQLScalarType } from "graphql"
import { getUserGuilds } from "../../utils/api"
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
//Discord Api Calls

export const MutualGuildType = new GraphQLObjectType({
    name: 'MutualGuildType',
    fields: () =>({
        excluded: {type: new GraphQLList(GuildType)},
        included: {type: new GraphQLList(GuildType)}
    })
});

const GuildType = new GraphQLObjectType({
    name: 'GuildType',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        icon: {type: GraphQLString},
        owner: {type: GraphQLBoolean},
        permissions: {type: GraphQLInt},
        features: {type: GraphQLList(GraphQLString)},
        permissions_new: {type: GraphQLString}
    })
})

export const GuildRoleType = new GraphQLObjectType({
    name: 'GuildRoleType',
    fields: () => ({
        id : {type: GraphQLString},
        name : {type: GraphQLString},
        color : {type: GraphQLInt},
        hoist : {type: GraphQLBoolean},
        position : {type: GraphQLInt},
        permissions : {type: GraphQLInt},
        permissions_new : {type: GraphQLString},
        managed : {type: GraphQLBoolean},
        mentionable : {type: GraphQLBoolean},
    })
})


export const GuildChannelType = new GraphQLObjectType({
    name: 'GuildChannelType',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        type: {type: GraphQLInt},
        topic: {type: GraphQLString},
        bitrate: {type: GraphQLInt},
        user_limit: {type: GraphQLInt},
        rate_limit_per_user: {type: GraphQLInt},
        position: {type: GraphQLInt},
        permission_overwrites: {type: GraphQLList(Permission_OverWrite)},
        parent_id: {type: GraphQLString},
        nsfw: {type: GraphQLBoolean},
    })
})

export const Permission_OverWrite = new GraphQLObjectType({
    name: 'Permission_OverWrite',
    fields: () =>({
        id: {type: GraphQLString},
        type: {type: GraphQLInt},
        allow: {type: GraphQLString},
        deny: {type: GraphQLString},
    })
})

export const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        discordTag: { type: GraphQLString},
        discordId: { type: GraphQLString},
        avatar: { type: GraphQLString},
        guilds: {
            type: new GraphQLList(GuildType),
            resolve(parent, args, request) {
                return request.user ? getUserGuilds(request.user.discordId) : null
            }
        }
    })
})

//DataBaseCalls

//Guild Config
export const GuildConfigType = new GraphQLObjectType({
    name: 'GuildConfigType',
    fields: () => ({ // has to mach Guild Config DataBase
        guildId: {type: GraphQLString},
        guildShard: {type: GraphQLString},
        guildPort: {type: GraphQLString},
        prefix: {type: GraphQLString},
        defaultRole: {type: GraphQLString},
        silverCoins: {type: GraphQLInt},
        goldCoins: {type: GraphQLInt},
        silverLog: {type: GraphQLList(TransactionType)},
        goldLog: {type: GraphQLList(TransactionType)},
    })
});

const TransactionType = new GraphQLObjectType({
    name: 'TransactionType',
    fields: () => ({
        amount: {type: GraphQLInt},
        from: {type: GraphQLString},
        date: {type: GraphQLString},
        note: {type: GraphQLString},
    })
});

// const ModulesType = new GraphQLObjectType({
//     name: 'ModulesType',
//     fields: () => ({
//         modules: {type: GraphQLList(ModuleType)}
//     })
// })

export const MusicModuleType = new GraphQLObjectType({
    name: 'ModuleType',
    fields: () => ({
        guildId:{ type: GraphQLString},
        moduleType: {type: GraphQLString},
        on: {type: GraphQLBoolean},
        cost: {type: GraphQLInt},
        orderedOn: {type: GraphQLInt},
        expires: {type: GraphQLInt},
        //music Module
        prefix: {type: GraphQLString},
        status: {type: GraphQLString},
        djRole: {type: GraphQLString},
        defaultChannel: {type: GraphQLString},
        display: {type: GraphQLBoolean},
        shuffle: {type: GraphQLBoolean},
        activePlaylist: {type: ActivePlaylistType},
        songs: {type: GraphQLList(SongType)},
        savedPlaylists: {type: GraphQLList(PlaylistType)},
    })
})

export const ActivePlaylistType = new GraphQLObjectType({
    name: 'ActivePlaylistType',
    fields: () => ({
        songs: {type:  GraphQLJSONObject},
    })
})

const PlaylistType = new GraphQLObjectType({
    name: 'PlaylistType',
    fields: () => ({
        author: {type: GraphQLString},
        songs: {type: GraphQLJSONObject},
    })
})

export const SongType = new GraphQLObjectType({
    name: 'SongType',
    fields: () => ({
        title: {type: GraphQLString},
        link: {type: GraphQLString},
        author: {type: GraphQLString},
        thumbnail: {type: GraphQLString},
    })  
})