import fetch from 'node-fetch';
import { config } from '../config';
import { OAuth2Credentials } from '../database/schemas/OAuth2Credentials'
import { decrypt } from './utils'
import CryptoJS from 'crypto-js';
import axios from 'axios'
import { apiGuildChannel } from '../apis/apiDiscord/apiChannel';
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
