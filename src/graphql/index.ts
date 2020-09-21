import {
    GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLInt, GraphQLSchema, GraphQLScalarType
    
}from 'graphql'
import { getUserGuilds, getBotGuilds, getGuildRoles } from '../utils/api'
import { getMutualGuilds } from '../utils/utils'
import { guildConfigDb } from '../database/schemas/GuildConfig';
import { MutualGuildType, GuildConfigType, GuildRoleType, UserType} from './queries/Types';

const MutationQuery = new GraphQLObjectType({
    name: 'RootMutationQuery',
    fields:{
        updateGuildPrefix:{
            type: GuildConfigType,
            args:{
                guildId:{ type: GraphQLString},
                prefix:{type: GraphQLString},
            },
            async resolve(parent, args, request){
                const {guildId, prefix} = args;
                if(!guildId || !prefix || !request.user) return null;
                const config = await guildConfigDb.findOneAndUpdate({guildId},{prefix},{new: true});
                return config ? config : null;
            },
        },
        updateDefaultRole:{
            type: GuildConfigType,
            args:{
                guildId:{ type: GraphQLString},
                defaultRole:{type: GraphQLString},
            },
            async resolve(parent, args, request){
                const {guildId, defaultRole} = args;
                if(!guildId || !defaultRole || !request.user) return null;
                const config = await guildConfigDb.findOneAndUpdate({guildId},{defaultRole},{new: true});
                return config ? config : null;
            }
        }
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields:{
        getUser:{
            type: UserType,
            resolve(parent, args, request){
                return request.user ? request.user : null
            }
        },
        getMutualGuilds:{
            type: MutualGuildType,
            async resolve(parent, args, request){
                if (request.user) {
                    const userGuilds = await getUserGuilds(request.user.discordId);
                    const botGuilds = await getBotGuilds();
                    return getMutualGuilds(userGuilds, botGuilds)
                } return null
            }
        },
        getGuildConfig:{
            type: GuildConfigType,
            args:{
                guildId: {type: GraphQLString},
            },
            async resolve (parent, args, request){
                const {guildId} = args;
                if (!guildId || !request.user) return null
                const config = await guildConfigDb.findOne({guildId});
                return config ? config : null;
            }
        },
        getGuildRoles:{
            type: new GraphQLList(GuildRoleType),
            args:{
                guildId: {type: GraphQLString},
            },
            async resolve (parent, args, request){
                const {guildId} = args;
                if (!guildId || !request.user) return null
                return getGuildRoles(guildId);
            } 

        }
    }
})

export const RootSchema = new GraphQLSchema({query: RootQuery, mutation: MutationQuery})