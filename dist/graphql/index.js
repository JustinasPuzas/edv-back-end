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
const youtube_dl_1 = require("youtube-dl");
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
        updateMusicBotActivePlaylist: {
            type: graphql_1.GraphQLList(Types_1.SongType),
            args: {
                guildId: { type: graphql_1.GraphQLString },
                newMusic: { type: graphql_1.GraphQLList(graphql_1.GraphQLString) },
                removeMusic: { type: graphql_1.GraphQLList(graphql_1.GraphQLString) }
            },
            resolve(parent, args, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { guildId, newMusic, removeMusic, titles } = args;
                    if (!guildId || !newMusic || !request.user)
                        return null;
                    const config = yield GuildConfig_1.guildConfigDb.findOne({ guildId });
                    if (!config)
                        return null;
                    const modules = config.modules;
                    if (!modules)
                        return null;
                    const musicModule = modules.get(`MUSIC`);
                    if (!musicModule)
                        return null;
                    const songsMap = new Map();
                    for (let i of newMusic) {
                        let link = i;
                        let removedSongs = removeMusic;
                        if (removedSongs.includes(link))
                            continue;
                        function promise(url) {
                            return __awaiter(this, void 0, void 0, function* () {
                                const options = ['--username=user', '--password=hunter2'];
                                return new Promise((resolve, reject) => {
                                    youtube_dl_1.getInfo(url, options, (err, info) => {
                                        if (err) {
                                            reject(err);
                                            throw err;
                                        }
                                        else {
                                            resolve(info);
                                        }
                                    });
                                });
                            });
                        }
                        let info = yield promise(link);
                        if (!info)
                            continue;
                        let song = {
                            link: `https://youtu.be/${info.id}`,
                            title: `${info.title}`,
                            author: `${request.user.discordId}`,
                            thumbnail: `https://img.youtube.com/vi/${info.id}/0.jpg`
                        };
                        songsMap.set(`https://youtu.be/${info.id}`, song);
                        console.log(songsMap);
                    }
                    const playListFromDb = new Map(Object.entries(musicModule.activePlaylist.songs));
                    for (let i of removeMusic) {
                        let link = i;
                        playListFromDb.delete(link);
                    }
                    const filedMap = new Map([...songsMap, ...playListFromDb]);
                    musicModule.activePlaylist.songs = filedMap;
                    modules.set(`MUSIC`, musicModule);
                    const updatedConfig = yield GuildConfig_1.guildConfigDb.findOneAndUpdate({ guildId }, { modules }, { new: true });
                    try {
                        api_1.updateMusicBot(guildId);
                    }
                    catch (_a) {
                        console.log(`Bot is offline`);
                    }
                    return updatedConfig ? filedMap.values() : null;
                });
            },
        },
        updateMusicBotState: {
            type: Types_1.MusicModuleType,
            args: {
                guildId: { type: graphql_1.GraphQLString },
                on: { type: graphql_1.GraphQLBoolean },
            },
            resolve(parent, args, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { guildId, on } = args;
                    if (!guildId || !request.user)
                        return null;
                    const config = yield GuildConfig_1.guildConfigDb.findOne({ guildId });
                    if (!config)
                        return null;
                    const modules = config.modules;
                    if (!modules)
                        return null;
                    const musicModule = modules.get(`MUSIC`);
                    if (!musicModule)
                        return null;
                    musicModule.on = on;
                    modules.set(`MUSIC`, musicModule);
                    const updatedConfig = yield GuildConfig_1.guildConfigDb.findOneAndUpdate({ guildId }, { modules }, { new: true });
                    try {
                        api_1.updateMusicBot(guildId);
                    }
                    catch (_a) { }
                    return updatedConfig ? true : null;
                });
            },
        },
        updateMusicBotDisplay: {
            type: Types_1.MusicModuleType,
            args: {
                guildId: { type: graphql_1.GraphQLString },
                display: { type: graphql_1.GraphQLBoolean },
            },
            resolve(parent, args, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { guildId, display } = args;
                    if (!guildId || !request.user)
                        return null;
                    const config = yield GuildConfig_1.guildConfigDb.findOne({ guildId });
                    if (!config)
                        return null;
                    const modules = config.modules;
                    if (!modules)
                        return null;
                    const musicModule = modules.get(`MUSIC`);
                    if (!musicModule)
                        return null;
                    musicModule.display = display;
                    console.log(musicModule);
                    modules.set(`MUSIC`, musicModule);
                    const updatedConfig = yield GuildConfig_1.guildConfigDb.findOneAndUpdate({ guildId }, { modules }, { new: true });
                    try {
                        api_1.updateMusicBot(guildId);
                    }
                    catch (_a) { }
                    return updatedConfig ? true : null;
                });
            },
        },
        updateMusicBotShuffle: {
            type: Types_1.MusicModuleType,
            args: {
                guildId: { type: graphql_1.GraphQLString },
                shuffle: { type: graphql_1.GraphQLBoolean },
            },
            resolve(parent, args, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { guildId, shuffle } = args;
                    if (!guildId || !request.user)
                        return null;
                    const config = yield GuildConfig_1.guildConfigDb.findOne({ guildId });
                    if (!config)
                        return null;
                    const modules = config.modules;
                    if (!modules)
                        return null;
                    const musicModule = modules.get(`MUSIC`);
                    if (!musicModule)
                        return null;
                    musicModule.shuffle = shuffle;
                    console.log(musicModule);
                    modules.set(`MUSIC`, musicModule);
                    const updatedConfig = yield GuildConfig_1.guildConfigDb.findOneAndUpdate({ guildId }, { modules }, { new: true });
                    try {
                        api_1.updateMusicBot(guildId);
                    }
                    catch (_a) { }
                    return updatedConfig ? true : null;
                });
            },
        },
        updateMusicBotPrefix: {
            type: Types_1.MusicModuleType,
            args: {
                guildId: { type: graphql_1.GraphQLString },
                prefix: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { guildId, prefix } = args;
                    if (!guildId || !prefix || !request.user)
                        return null;
                    const config = yield GuildConfig_1.guildConfigDb.findOne({ guildId });
                    if (!config)
                        return null;
                    const modules = config.modules;
                    if (!modules)
                        return null;
                    const musicModule = modules.get(`MUSIC`);
                    if (!musicModule)
                        return null;
                    musicModule.prefix = prefix;
                    modules.set(`MUSIC`, musicModule);
                    const updatedConfig = yield GuildConfig_1.guildConfigDb.findOneAndUpdate({ guildId }, { modules }, { new: true });
                    try {
                        api_1.updateMusicBot(guildId);
                    }
                    catch (_a) { }
                    return updatedConfig ? true : null;
                });
            },
        },
        updateMusicBotDefaultChannel: {
            type: Types_1.MusicModuleType,
            args: {
                guildId: { type: graphql_1.GraphQLString },
                defaultChannel: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { guildId, defaultChannel } = args;
                    if (!guildId || !defaultChannel || !request.user)
                        return null;
                    const config = yield GuildConfig_1.guildConfigDb.findOne({ guildId });
                    if (!config)
                        return null;
                    const modules = config.modules;
                    if (!modules)
                        return null;
                    const musicModule = modules.get(`MUSIC`);
                    if (!musicModule)
                        return null;
                    musicModule.defaultChannel = defaultChannel;
                    modules.set(`MUSIC`, musicModule);
                    const updatedConfig = yield GuildConfig_1.guildConfigDb.findOneAndUpdate({ guildId }, { modules }, { new: true });
                    try {
                        api_1.updateMusicBot(guildId);
                    }
                    catch (_a) { }
                    return updatedConfig ? true : null;
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
        },
        getGuildVoiceChannels: {
            type: new graphql_1.GraphQLList(Types_1.GuildChannelType),
            args: {
                guildId: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { guildId } = args;
                    if (!guildId || !request.user)
                        return null;
                    const guildChannels = yield api_1.getGuildChannels(guildId);
                    return utils_1.getGuildVoiceChannels(guildChannels);
                });
            }
        },
        //Modules
        getMusicModule: {
            type: Types_1.MusicModuleType,
            args: {
                guildId: { type: graphql_1.GraphQLString },
                moduleType: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { guildId } = args;
                    if (!guildId || !request.user)
                        return null;
                    const config = yield GuildConfig_1.guildConfigDb.findOne({ guildId });
                    if (!config)
                        return null;
                    if (!config.modules)
                        return null;
                    const musicModule = config.modules.get(`MUSIC`);
                    return musicModule ? musicModule : null;
                });
            }
        },
    }
});
exports.RootSchema = new graphql_1.GraphQLSchema({ query: RootQuery, mutation: MutationQuery });
