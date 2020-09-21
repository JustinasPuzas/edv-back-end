import express from 'express';
export const router = express.Router();
import { getBotGuilds, getGuildRoles, getUserGuilds} from '../utils/api';
import { config } from '../config';
import { getMutualGuilds } from '../utils/utils';
import { guildConfigDb } from '../database/schemas/GuildConfig';
import axios from 'axios';



router.get('/guilds', async ( req:any, res:any) => {


    const guilds = await getBotGuilds();

    //const user = await User.findOne( { discordId: req.user.discordId } );
        if(req.user){
            const userGuilds = await getUserGuilds(req.user.discordId);
            const mutualGuilds = getMutualGuilds(userGuilds, guilds)
            res.send(mutualGuilds)
        }else{
            res.status(401).send({msg:'Unauthorized'})
        }
});

router.get('/guilds/:guildId/config', async (req:any, res:any)=>{
    const { guildId } = req.params;
    const config = await guildConfigDb.findOne({guildId});
    return config? res.send(config) : res.status(404).send({msg: 'Not found'})
});

router.get('/guilds/:guildId/roles' , async (req:any, res:any) =>{
    const {guildId} = req.params;
    try{
        const roles = await getGuildRoles(guildId)
        res.send(roles)
    }catch (err){
        console.log(err)
        res.status(400).send({msg: "Internal Server Error"})
    }
});

router.put('/guilds/:guildId/roles/default', async (req:any, res:any)=>{
    const { defaultRole } = req.body;
    if( !defaultRole ) return res.status(400).send({msg: "Bad Request"})
    const { guildId } = req.params;
    try{
        const update = await guildConfigDb.findOneAndUpdate({guildId},{defaultRole},{new: true});
        return update ? res.send(update) : res.status(400).send({msg: "Bad Request"})
    }catch (err){
        console.log(err)
        res.status(500).send({msg: "Internal Server Error"})
    }
});

router.put('/guilds/:guildId/prefix', async (req:any, res:any) =>{
    const { prefix } = req.body;
    const { guildId } = req.params;
    if(!prefix) return res.status(400).send({msg: "Prefix Required"});
    if(prefix.length > 5) return res.status(400).send({msg: "Prefix max length 5"});

        const update = await guildConfigDb.findOneAndUpdate({guildId}, {prefix}, {new: true})

    if(update){
       
        return res.status(200).send(update)
    }else{
        return res.status(400).send({msg: 'Could not find document'})
    }

});
