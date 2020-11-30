import { config } from './config';
import express from 'express';
import './strategys/discord';
import { router } from './routes';
import passport from 'passport';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
const Store =  require( 'connect-mongo')(session);
import { graphqlHTTP } from 'express-graphql';
import { RootSchema } from './graphql';

const app = express();
const PORT = config.PORT || 3002;

mongoose.connect( `${config.dataBase}`, {
    authSource: config.authSource,
            authMechanism: config.authMechanism,
            user: config.user,
            pass: config.pass,
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
})

app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use(cors({
    allowedHeaders: ['sessionId', 'Content-Type'],
    exposedHeaders: ['sessionId'],
    origin: `${config.frontEndUrl}`,
    methods: 'GET,HEAD,PUT,POST',
    credentials: true,
}));


app.use( session({ 
    secret: 'secret',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    resave: true,
    saveUninitialized: false,
    store: new Store( {mongooseConnection: mongoose.connection}),
}));

app.use( passport.initialize() );
app.use( passport.session() );

app.use('/graphql', graphqlHTTP({
    schema: RootSchema,
    graphiql: true
}));

app.use(`/api`, router);

app.listen(PORT, () => console.log(`Running on Port ${config.frontEndUrl} : ${PORT}`));

