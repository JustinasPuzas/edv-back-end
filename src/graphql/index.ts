import {
    GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLInt, GraphQLSchema, GraphQLScalarType
    
}from 'graphql'
import { getUserGuilds, getBotGuilds, getGuildRoles, getGuildChannels, updateMusicBot } from '../utils/api'
import { getGuildVoiceChannels, getMutualGuilds } from '../utils/utils'
import { guildConfigDb } from '../database/schemas/GuildConfig';
import { MutualGuildType, GuildConfigType, GuildRoleType, UserType, MusicModuleType, GuildChannelType, SongType} from './queries/Types';
import { apiGuildConfig, apiMusicModule, apiSong } from '../apis';
const ytdl = require('discord-ytdl-core');

const MutationQuery = new GraphQLObjectType({
    name: 'RootMutationQuery',
    fields:{
        updateGuildPrefix:{
            type: GuildConfigType,
            args:{
                guildId:{ type: GraphQLString},
                prefix:{type: GraphQLString},
            },
            async resolve(parent,args, request){
                const {guildId, prefix} = args;
                if(!guildId || !prefix || !request.user) return null;
                const config = await guildConfigDb.findOneAndUpdate({guildId},{prefix},{new: true});
                return config ? config : null;
            },
        },
        updateMusicBotActivePlaylist:{
            type: GraphQLList(SongType),
            args:{
                guildId:{ type: GraphQLString},
                newMusic: {type: GraphQLList(GraphQLString)},
                removeMusic: {type: GraphQLList(GraphQLString)}
            },
            async resolve(parent, args, request){
                const {guildId, newMusic, removeMusic, titles} = args;
                if(!guildId || !newMusic || !request.user) return null;
                const config = await guildConfigDb.findOne({guildId}) as unknown as apiGuildConfig;

                if(!config) return null
                const modules = config.modules

                if(!modules) return null

                const musicModule = modules.get(`MUSIC`) as apiMusicModule

                if(!musicModule) return null
                const songsMap:Map<string, apiSong> = new Map()


                for (let i of newMusic as string[]){
                    let link = i
                    let removedSongs = removeMusic as string[]
                    if( removedSongs.includes(link) ) continue;

                    let songInfoFromYtApi = (await ytdl.getBasicInfo(link)).videoDetails
                    if (!songInfoFromYtApi) continue;
                    let song: apiSong = {
                        link: `https://youtu.be/${songInfoFromYtApi.videoId}`,
                        title: `${songInfoFromYtApi.title}`,
                        author: `${request.user.discordId}`,
                        thumbnail: `https://img.youtube.com/vi/${songInfoFromYtApi.videoId}/0.jpg`
                    }
                    songsMap.set(`https://youtu.be/${songInfoFromYtApi.videoId}`, song)
                }
                const playListFromDb = new Map(Object.entries(musicModule.activePlaylist.songs))
                for(let i of removeMusic){
                    let link = i;
                    playListFromDb.delete(link);
                }
                const filedMap = new Map([...songsMap, ...playListFromDb])
                console.log(request.user)
                musicModule.activePlaylist.songs = filedMap
                modules.set(`MUSIC`, musicModule)
                const updatedConfig = await guildConfigDb.findOneAndUpdate({guildId},{modules}, {new: true}) as unknown as apiGuildConfig;
                updateMusicBot(guildId)
                return updatedConfig ? filedMap.values() : null;
            },
        },
        updateMusicBotState:{
            type: MusicModuleType,
            args:{
                guildId:{ type: GraphQLString},
                on:{ type: GraphQLBoolean},
            },
            async resolve(parent, args, request){
                const {guildId, on} = args;
                if(!guildId || !request.user) return null;
                const config = await guildConfigDb.findOne({guildId}) as unknown as apiGuildConfig;
                if(!config) return null
                const modules = config.modules
                if(!modules) return null
                const musicModule = modules.get(`MUSIC`) as apiMusicModule
                if(!musicModule) return null
                musicModule.on = on
                modules.set(`MUSIC`, musicModule)
                const updatedConfig = await guildConfigDb.findOneAndUpdate({guildId},{modules}, {new: true}) as unknown as apiGuildConfig;
                updateMusicBot(guildId)
                return updatedConfig ? true : null;
            },
        },
        updateMusicBotDisplay:{
            type: MusicModuleType,
            args:{
                guildId:{ type: GraphQLString},
                display:{ type: GraphQLBoolean},
            },
            async resolve(parent, args, request){
                const {guildId, display} = args;
                if(!guildId || !request.user) return null;
                const config = await guildConfigDb.findOne({guildId}) as unknown as apiGuildConfig;
                if(!config) return null
                const modules = config.modules
                if(!modules) return null
                const musicModule = modules.get(`MUSIC`) as apiMusicModule
                if(!musicModule) return null

                musicModule.display = display
                console.log(musicModule)
                modules.set(`MUSIC`, musicModule)
                const updatedConfig = await guildConfigDb.findOneAndUpdate({guildId},{modules}, {new: true}) as unknown as apiGuildConfig;
                updateMusicBot(guildId)
                return updatedConfig ? true : null;
            },
        },
        updateMusicBotShuffle:{
            type: MusicModuleType,
            args:{
                guildId:{ type: GraphQLString},
                shuffle:{ type: GraphQLBoolean},
            },
            async resolve(parent, args, request){
                const {guildId, shuffle} = args;
                if(!guildId || !request.user) return null;
                const config = await guildConfigDb.findOne({guildId}) as unknown as apiGuildConfig;
                if(!config) return null
                const modules = config.modules
                if(!modules) return null
                const musicModule = modules.get(`MUSIC`) as apiMusicModule
                if(!musicModule) return null
                musicModule.shuffle = shuffle
                console.log(musicModule)
                modules.set(`MUSIC`, musicModule)
                const updatedConfig = await guildConfigDb.findOneAndUpdate({guildId},{modules}, {new: true}) as unknown as apiGuildConfig;
                updateMusicBot(guildId)
                return updatedConfig ? true : null;
            },
        },
        updateMusicBotPrefix:{
            type: MusicModuleType,
            args:{
                guildId:{ type: GraphQLString},
                prefix:{ type: GraphQLString},
            },
            async resolve(parent, args, request){
                const {guildId, prefix} = args;
                if(!guildId || !prefix || !request.user) return null;
                const config = await guildConfigDb.findOne({guildId}) as unknown as apiGuildConfig;
                if(!config) return null
                const modules = config.modules
                if(!modules) return null
                const musicModule = modules.get(`MUSIC`) as apiMusicModule
                if(!musicModule) return null
                musicModule.prefix = prefix
                modules.set(`MUSIC`, musicModule)
                const updatedConfig = await guildConfigDb.findOneAndUpdate({guildId},{modules}, {new: true}) as unknown as apiGuildConfig;
                updateMusicBot(guildId)
                return updatedConfig ? true : null;
            },
        },
        updateMusicBotDefaultChannel:{
            type: MusicModuleType,
            args:{
                guildId:{ type: GraphQLString},
                defaultChannel:{ type: GraphQLString},
            },
            async resolve(parent, args, request){
                const {guildId,defaultChannel} = args;
                if(!guildId || !defaultChannel || !request.user) return null;
                const config = await guildConfigDb.findOne({guildId}) as unknown as apiGuildConfig;
                if(!config) return null
                const modules = config.modules
                if(!modules) return null
                const musicModule = modules.get(`MUSIC`) as apiMusicModule
                if(!musicModule) return null
                musicModule.defaultChannel = defaultChannel
                modules.set(`MUSIC`, musicModule)
                const updatedConfig = await guildConfigDb.findOneAndUpdate({guildId},{modules}, {new: true}) as unknown as apiGuildConfig;
                updateMusicBot(guildId)
                return updatedConfig ? true : null;
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

        },
        getGuildVoiceChannels:{
            type: new GraphQLList(GuildChannelType),
            args:{
                guildId: {type: GraphQLString},
            },
            async resolve (parent, args, request){
                const {guildId} = args;
                if (!guildId || !request.user) return null
                const guildChannels = await getGuildChannels(guildId)

                return getGuildVoiceChannels(guildChannels)
            } 
        },
        //Modules
        getMusicModule:{
            type: MusicModuleType,
            args:{
                guildId: {type: GraphQLString},
                moduleType: {type: GraphQLString},
            },
            async resolve (parent, args, request){
                const {guildId} = args;
                if(!guildId || !request.user) return null
                const config = await guildConfigDb.findOne({guildId}) as unknown as apiGuildConfig
                if(!config) return null
                if(!config.modules) return null
                const musicModule = config.modules.get(`MUSIC`)
                return musicModule ? musicModule : null;
            }

        },
    }
})

export const RootSchema = new GraphQLSchema({query: RootQuery, mutation: MutationQuery})