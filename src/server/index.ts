import express from 'express';
import expressWS from 'express-ws';
import bodyParser from 'body-parser';
import config from '../handlers/configHandler';
import cors from 'cors';
import util from '../utils'.default;

const app = express();

expressWS(app);

app.use(cors());
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use("/api", require('./routes/api'));

app.use("/ws", require('./routes/ws_server'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const server = app.listen(config.server.port, () => {
    util.server_message.log(`Server listening on port ${config.server.port}`);
});

util.events.on("stop_server", function() {
    util.server_message.log(`Server stopped`);
    server.close();
});

util.ws_client_message.log("Starting WS-Client ...");
require("./ws_client");
util.ws_client_message.log("WS-Client started");