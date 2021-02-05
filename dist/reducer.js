"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduce = void 0;
const log_1 = require("./lib/log");
//{ "to": "TjKpALIfCuA8Ifg1AAA", "content": {"message":{"from":{"username":"Kioskito"},"isSender":true,"message":{"content":"Hola !"}}}, "isBot": false, "from": "", "company": "", "room": "chat@kioskito"}
/**

{ "to": "0yE6V1XS4__l1jByAAAX", "content": {"message":{"content":"Hello kioskito i'am the aster"}}, "isBot": false, "from": {"uuid":"BSblFs8s0nkSvoCCAAAZ"}, "company": "", "room": ""}

**/
/**
 *
 * @param socket
 * @param io
 * @param action
 * @param payload
 * @param clients
 */
const reduce = (socket, io, action, payload, clients) => {
    var _a, _b, _c, _d, _e;
    let room;
    const addUser = (data = {}) => {
        if (!clients[io.name]) {
            clients[io.name] = { count: 0, scope: io.name, online: {} };
        }
        const current = clients[io.name]["onlines"] || {};
        clients[io.name] = {
            count: io.sockets.size,
            scope: io.name,
            company: payload === null || payload === void 0 ? void 0 : payload.company,
            onlines: Object.assign(Object.assign({}, current), { [socket.id]: Object.assign({ uuid: socket.id }, data) }),
        };
    };
    switch (action) {
        case "register":
            if (payload) {
                if (clients[io.name]) {
                    addUser((payload === null || payload === void 0 ? void 0 : payload.content) || {});
                    io.emit("last:users", clients[io.name]);
                    io.to(socket.id).emit("register", (_a = clients[io.name]) === null || _a === void 0 ? void 0 : _a.onlines[socket.id]);
                }
            }
            break;
        case "message":
            if (payload) {
                io.to((_b = payload.dest) === null || _b === void 0 ? void 0 : _b.uuid)
                    .to((_c = payload.dest) === null || _c === void 0 ? void 0 : _c.phone)
                    .to(payload.room)
                    .to(payload.company)
                    .to(socket.id)
                    .to("master")
                    .emit("message", payload);
            }
            break;
        case "private:message":
            if (payload) {
                io.to((_d = payload.dest) === null || _d === void 0 ? void 0 : _d.uuid)
                    .to((_e = payload.dest) === null || _e === void 0 ? void 0 : _e.phone)
                    .to(payload.company)
                    .to(socket.id)
                    .to("master")
                    .emit("message", payload);
            }
            break;
        case "join":
            if (payload === null || payload === void 0 ? void 0 : payload.room) {
                socket.join(payload.room);
                io.to(payload.room)
                    .to(socket.id)
                    .to("master")
                    .emit("join", { uuid: socket.id, room: payload.room });
            }
            break;
        case "leave":
            if (payload === null || payload === void 0 ? void 0 : payload.room) {
                socket.leave(payload.room);
                io.to(payload.room)
                    .to(socket.id)
                    .to("master")
                    .emit("leave", { uuid: socket.id, room: payload.room });
            }
            break;
        case "connection":
            //----
            addUser({});
            io.emit("last:users", clients[io.name]);
            break;
        case "disconnect":
        case "close":
            log_1.default(`client:${socket.id} left connection`);
            if (clients)
                delete clients[io.name]["onlines"][socket.id];
            clients[io.name]["count"] = io.sockets.size;
            io.emit("left", { uuid: socket.id });
            io.emit("last:users", clients[io.name]);
            break;
        default:
            break;
    }
};
exports.reduce = reduce;
//# sourceMappingURL=reducer.js.map