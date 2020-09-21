import express from 'express';
import { router as auth } from './auth';
import { router as discord } from './discord';

export const router = express.Router();

router.use('/auth', auth);
router.use('/discord', discord)