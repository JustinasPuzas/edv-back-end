import { Schema, model} from 'mongoose';

export const youtubeMusicDb = model( 'youtubeMusicDb', new Schema({
    id: {
      type: String,
      required: true,
      unique: true,
    },
    thumbnail:{
        type: String,
        required: false
    },
    link:{
        type: String,
        required: true,
        unique: true,
    },
    title:{
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
    },
    uploader:{
        type: String,
        required: false,
    },
    author: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: false,
    },
    downloaded:{
        type: Boolean,
        required: true
    }
  } ));