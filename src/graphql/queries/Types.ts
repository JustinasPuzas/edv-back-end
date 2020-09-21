import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLInt } from "graphql"
import { getUserGuilds } from "../../utils/api"

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
        prefix: {type: GraphQLString},
        defaultRole: {type: GraphQLString},
        silverCoins: {type: GraphQLInt},
        goldCoins: {type: GraphQLInt},
        silverLog: {type: GraphQLList(TransactionType)},
        goldLog: {type: GraphQLList(TransactionType)},
        modules: {type: GraphQLList(ModuleType)},
        voiceModule: {type: GraphQLList(VoiceModuleType)},
        // announcementPanelModule: {type: GraphQLList(announcementPanelModuleType)},
        // rolePersistModule: 
        // ticketModule: {type: GraphQLList(ticketModuleType)},
        // moderationModule: {type: GraphQLList(ModerationModuleType)},
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

const ModuleType = new GraphQLObjectType({
    name: 'ModuleType',
    fields: () => ({
        moduleType: {type: GraphQLString},
        status: {type: GraphQLString},
        orderedOn: {type: GraphQLString},
        expires: {type: GraphQLString},
    })
})

const CategoryType = new GraphQLObjectType({
    name: 'CategoryType',
    fields: () => ({
        channelId: {type: GraphQLString},
        spawn: {type: GraphQLBoolean},
        listeners: {type: GraphQLList(GraphQLString)},
    })
})

const VoiceModuleType = new GraphQLObjectType({
    name: 'VoiceModuleType',
    fields: () => ({
        category: {type: GraphQLList(CategoryType)},
        moderatorRole: {type: GraphQLString},
        voiceBanRole: {type: GraphQLString},
    })
})