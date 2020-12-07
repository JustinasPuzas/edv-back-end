import fetch from 'node-fetch';
import { config } from '../config';
import { OAuth2Credentials } from '../database/schemas/OAuth2Credentials'
import { decrypt } from './utils'
import CryptoJS from 'crypto-js';
import axios from 'axios'
import { apiGuildChannel } from '../apis/apiDiscord/apiChannel';
import { apiSong } from '../apis/apiDatabase/apiGuildConfig';
import { youtubeMusicDb } from '../database/schemas/youtubeMusicDb';
import { apiYoutubeVideo } from '../apis/apiYoutube/songInfo';
import {getInfo} from 'youtube-dl'
const DISCORD_API = 'http://discord.com/api/v6'

export async function getBotGuilds() {
    const response = await fetch(`${DISCORD_API}/users/@me/guilds`, {
        method: 'GET',
        headers:{
            Authorization: `Bot ${config.token}`
        }
    });
    return response.json();
}


export async function getGuildRoles(guildId:string) {
    const response = await fetch(`${DISCORD_API}/guilds/${guildId}/roles`, {
        method: 'GET',
        headers:{
            Authorization: `Bot ${config.token}`
        }
    });
    return response.json();
}

export async function getGuildChannels(guildId:string):Promise<apiGuildChannel[]> {
    const response = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
        method: 'GET',
        headers:{
            Authorization: `Bot ${config.token}`
        }
    });
    return await response.json() as apiGuildChannel[];
}

export async function getUserGuilds(discordId:string) {
    try{
        const credentials = await OAuth2Credentials.findOne({ discordId })
        if (!credentials) throw new Error("No credentials");

        const encryptedAccessToken = credentials.get('accessToken');
        const decrypted = decrypt(encryptedAccessToken);
        const accessToken = decrypted.toString(CryptoJS.enc.Utf8);
        
        const response = await fetch(`${DISCORD_API}/users/@me/guilds`, {
            method: 'GET',
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        });
        return await response.json();
    }catch (err){
        console.log(err)
        return null
    }
}

export async function updateMusicBot(guildId: string) {
    try{
        const response = await axios.put(`${config.discordMusicEndUrl}/api/discord/config/music`, {
            guildId: guildId
        })
    }catch (err){
        console.log(err)
        return null
    }
}

export async function getYoutubeVideoInfo(id: string, requestBy: string):Promise<apiSong | null> {
    const songInfoDoc = await youtubeMusicDb.findOne({id})
    if(songInfoDoc){
        console.log(`FOUND VIDEO`)
        const songInfo = songInfoDoc as unknown as apiYoutubeVideo
        return {
            title: songInfo.title,
            link: songInfo.link,
            author: songInfo.uploader,
            thumbnail: songInfo.thumbnail,
        }
    }
    console.log(`SEARCHING VIDEO`)

    try{
        
    let info = await promise(`https://youtu.be/${id}`) as any

    if (!info) return null;

    let song: apiSong = {
        link: `https://youtu.be/${id}`,
        title: `${info.title}`,
        author: `${requestBy}`,
        thumbnail: `https://img.youtube.com/vi/${id}/0.jpg`
    }

    let songDb: apiYoutubeVideo = {
        id: `${id}`, // id of channel
        link: `https://youtu.be/${id}`,
        title: info.title,
        thumbnail: `https://img.youtube.com/vi/${id}/0.jpg`,
        duration: info._duration_raw,
        uploader: info.uploader,
        author: requestBy,
        type: 'MUSIC',
        downloaded: false,
    }
    console.log(songDb)
    await youtubeMusicDb.create(songDb)

    return song
    }catch(err) {
        console.log(err)
        return null
    }

}

async function promise(url:string){ 
    const options = ['--username=user', '--password=hunter2']
    return new Promise(
    (resolve, reject) => {

      getInfo(url, options ,(err:any, info:any)=>{
        if (err){
            reject(err)
            throw err
        }
        else{
            resolve(info)
        }
   })})}
