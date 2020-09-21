import {SchemaTypes , Schema, model} from 'mongoose';

export const OAuth2Credentials = model( 'OAuthCredentials', new Schema({

    accessToken:{
        type: String,
        required: true,
    },
    refreshToken:{
        type: String,
        required: true,
    },
    discordId:{
        type: String,
        required: true,
    },
  } ));