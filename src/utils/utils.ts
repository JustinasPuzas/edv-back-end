import { use } from "passport";
import CryptoJS from 'crypto-js';

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


export function encrypt(token:string):CryptoJS.WordArray {
    return CryptoJS.AES.encrypt(token, "test");
}

export function decrypt(token:string):CryptoJS.DecryptedMessage {
    return CryptoJS.AES.decrypt(token, "test");
}
