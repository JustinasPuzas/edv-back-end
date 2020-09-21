"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceModuleType = void 0;
const graphql_1 = require("graphql");
const CategoryType = new graphql_1.GraphQLObjectType({
    name: 'CategoryType',
    fields: () => ({
        channelId: { type: graphql_1.GraphQLString },
        spawn: { type: graphql_1.GraphQLBoolean },
        listeners: { type: graphql_1.GraphQLList(graphql_1.GraphQLString) },
    })
});
exports.VoiceModuleType = new graphql_1.GraphQLObjectType({
    name: 'VoiceModuleType',
    fields: () => ({
        category: { type: graphql_1.GraphQLList(CategoryType) },
        moderatorRole: { type: graphql_1.GraphQLString },
        voiceBanRole: { type: graphql_1.GraphQLString },
    })
});
