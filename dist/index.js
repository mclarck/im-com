"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./lib/log");
const reducer_1 = require("./reducer");
const https = require('https');
const fs = require('fs');
const options = {
    key: fs.readFileSync('.conf/key.pem'),
    cert: fs.readFileSync('.conf/cert.pem')
};
const server = https.createServer(options, function (req, res) { });
const io = require("socket.io")(server);
const clients = {};
const scope = io.of(new RegExp(`^\/\.+$`).compile());
scope.on("connection", (socket) => {
    const namespace = socket.nsp;
    try {
        reducer_1.reduce(socket, namespace, "connection", null, clients);
    }
    catch (e) {
        log_1.default(e.message);
    }
    //----------------
    socket.on("disconnect", () => {
        try {
            reducer_1.reduce(socket, namespace, "disconnect", null, clients);
        }
        catch (e) {
            log_1.default(e.message);
        }
    });
    //----------------
    socket.on("close", () => {
        try {
            reducer_1.reduce(socket, namespace, "close", null, clients);
        }
        catch (e) {
            log_1.default(e.message);
        }
    });
    //************ */
    socket.on("message", (payload) => {
        try {
            reducer_1.reduce(socket, namespace, "message", payload);
        }
        catch (e) {
            log_1.default(e.message);
        }
    });
    //************ */
    socket.on("register", (payload) => {
        try {
            reducer_1.reduce(socket, namespace, "register", payload, clients);
        }
        catch (e) {
            log_1.default(e.message);
        }
    });
    //************ */
    socket.on("private:message", (payload) => {
        try {
            reducer_1.reduce(socket, namespace, "private:message", payload);
        }
        catch (e) {
            log_1.default(e.message);
        }
    });
    //************ */
    socket.on("join", (payload) => {
        try {
            reducer_1.reduce(socket, namespace, "join", payload);
        }
        catch (e) {
            log_1.default(e.message);
        }
    });
    //************ */
    socket.on("leave", (payload) => {
        try {
            reducer_1.reduce(socket, namespace, "leave", payload);
        }
        catch (e) {
            log_1.default(e.message);
        }
    });
});
scope.use((socket, next) => {
    next();
});
server.listen(8080);
//# sourceMappingURL=index.js.map