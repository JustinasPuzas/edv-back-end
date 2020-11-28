import { use } from "passport";
import CryptoJS from 'crypto-js';
import { apiGuildChannel } from "../apis/apiDiscord/apiChannel";
import { config } from '.././config'

export function getMutualGuilds(userGuilds:any[], botGuilds:any[]):{included:any[], excluded:any[]} {

    //return userGuilds.filter((guild:any) => botGuilds.find((botGuild:any) => (botGuild.id === guild.id) && (guild.permissions & 0x20) === 0x20))

    const validGuilds = userGuilds.filter((guild:any) => (guild.permissions & 0x20) === 0x20);

    const included:any[] = [];
    const excluded = validGuilds.filter((guild:any) => {
        const findGuild = botGuilds.find((g:any) => g.id === guild.id);
        if(!findGuild) return guild;
        included.push(findGuild);
    })
    return {included, excluded}
}

export function getGuildVoiceChannels(guildChannels: apiGuildChannel[]){
    const voiceChannels = guildChannels.filter((channel:apiGuildChannel) => {
        if(channel.type == 2) return channel
    })
    return voiceChannels
}


export function encrypt(token:string):CryptoJS.WordArray {
    return CryptoJS.AES.encrypt(token, config.enKey);
}

export function decrypt(token:string):CryptoJS.DecryptedMessage {
    return CryptoJS.AES.decrypt(token, config.enKey);
}
