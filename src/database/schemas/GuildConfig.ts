import {SchemaTypes , Schema, model} from 'mongoose';

export const guildConfigDb = model( 'GuildConfig', new Schema({
    guildId: {
      type: String,
      required: true,
      unique: true,
    },
    guildShard: {
        type: String,
        required: false,
        unique: false
    },
    guildPort: {
        type: String,
        required: false,
        unique: false,
    },
    prefix: {
      type: String,
      required: true,
      default: "-lilu",
    },
    defaultRole:{
        type: String,
        required: false,
    },
    silverCoins:{
        type: Number,
        required: true,
        default: 500,
    },
    goldCoins:{
        type: Number,
        required: true,
        default: 100,
    },
    silverLog:{
        type: Array,
        required: true,
        default: [{
            amount:500,
            from:'',
            date: Date.now(),
            note:'For Guild Creation from IGORIS#1569 uwu'
        }]
    },
    goldLog:{
        type: Array,
        required: true,
        default: [{
            amount:100,
            from:'',
            date: Date.now(),
            note:'For Guild Creation from IGORIS#1569 uwu'
        }]
    },
    modules:{
        type: Array,
        required: true,
        default:[{
            moduleType: 'VOICE',
            status: 'FREE',
            orderedOn: Date.now(),
            expires:Date.now() + 1,
        }]
    },
    voiceModule:{
        type: Array,
        required: false,
    },
  } ));