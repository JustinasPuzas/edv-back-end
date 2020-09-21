import express from 'express';
import passport from 'passport';
import { config } from '../config';

export const router = express.Router();

router.get('/discord', passport.authenticate( 'discord' ));

router.get('/discord/redirect', passport.authenticate( 'discord' ), (req:any, res:any) =>{
    res.redirect( `${config.frontEndUrl}/menu` )
});

router.get( '/' ,(req:any, res:any) => {
    if(req.user){
        res.send(req.user);
    }
    else{
        res.send(401)
    }
});