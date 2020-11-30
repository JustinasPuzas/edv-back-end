"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const express_1 = __importDefault(require("express"));
require("./strategys/discord");
const routes_1 = require("./routes");
const passport_1 = __importDefault(require("passport"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const Store = require('connect-mongo')(express_session_1.default);
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("./graphql");
const app = express_1.default();
const PORT = config_1.config.PORT || 3002;
mongoose_1.default.connect(`${config_1.config.dataBase}`, {
    authSource: config_1.config.authSource,
    authMechanism: config_1.config.authMechanism,
    user: config_1.config.user,
    pass: config_1.config.pass,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cors_1.default({
    allowedHeaders: ['sessionId', 'Content-Type'],
    exposedHeaders: ['sessionId'],
    origin: `${config_1.config.frontEndUrl}`,
    methods: 'GET,HEAD,PUT,POST',
    credentials: true,
}));
app.use(express_session_1.default({
    secret: 'secret',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    resave: true,
    saveUninitialized: false,
    store: new Store({ mongooseConnection: mongoose_1.default.connection }),
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/graphql', express_graphql_1.graphqlHTTP({
    schema: graphql_1.RootSchema,
    graphiql: true
}));
app.use(`/api`, routes_1.router);
app.listen(PORT, () => console.log(`Running on Port ${config_1.config.frontEndUrl} : ${PORT}`));
