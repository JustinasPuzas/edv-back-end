import passport from 'passport';
import DiscordStrategy from 'passport-discord';
import { User } from '../database/schemas/User';
import { config } from '../config';
import {OAuth2Credentials} from  '../database/schemas/OAuth2Credentials';
import { encrypt } from '../utils/utils'


passport.serializeUser( (user:any, done)=>{
    done(null, user.discordId)
});

passport.deserializeUser( async ( discordId:string, done) =>{
    try{
        const user = await User.findOne( { discordId });
        return user ? done(null , user) : done( null, null);
    }catch (err) {
        console.error(err);
        done (err, null);
    }
});

passport.use(new DiscordStrategy(
     config.clientInfo
    , async ( accessToken ,refreshToken, profile, done) =>{
        const encryptedAccessToken = encrypt(accessToken).toString();
        const encryptedRefreshToken = encrypt(refreshToken).toString();
        const { email, id, username, discriminator, avatar, guilds } = profile;
        try{
            const findUser = await User.findOneAndUpdate( { discordId: id}, {
                discordTag: `${username}#${discriminator}`,
                avatar,
                email,
            }, { new: true});
            const findCredentials = await OAuth2Credentials.findOneAndUpdate({discordId: id}, {
                accessToken: encryptedAccessToken,
                refreshToken: encryptedRefreshToken,
            }, {new: true})


            if (findUser) {
                if(!findCredentials){
                    const newCredentials = await OAuth2Credentials.create({
                        accessToken: encryptedAccessToken,
                        refreshToken: encryptedRefreshToken,
                        discordId: id,
                    });
                }
                return done (null, findUser)
            }else{
                const newUser = User.create({
                    discordId: id,
                    discordTag: `${username}#${discriminator}`,
                    avatar,
                    email,
                });
                const newCredentials = await OAuth2Credentials.create({
                    accessToken: encryptedAccessToken,
                    refreshToken: encryptedRefreshToken,
                    discordId: id,
                });
                return done( null, newUser);
            }
        }catch ( err ){
            console.error(err)
            return done (err, undefined)
        }
})
)