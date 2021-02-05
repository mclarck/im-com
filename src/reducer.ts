import { Socket, Namespace } from "socket.io";
import Log from "./lib/log";

export type PayloadType = {
  dest: any;
  content: any;
  isBot?: boolean;
  sender: any;
  company: string;
  room: string;
  created: string;
};
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

export const reduce = (
  socket: Socket,
  io: Namespace,
  action: string,
  payload: PayloadType,
  clients?: any
) => {
  let room;
  const addUser = (data: any = {}) => {
    if (!clients[io.name]) {
      clients[io.name] = { count: 0, scope: io.name, online: {} };
    }
    const current = clients[io.name]["onlines"] || {};
    clients[io.name] = {
      count: io.sockets.size,
      scope: io.name,
      company: payload?.company,
      onlines: {
        ...current,
        [socket.id]: { uuid: socket.id, ...data },
      },
    };
  };
  switch (action) {
    case "register":
      if (payload) {
        if (clients[io.name]) {
          addUser(payload?.content || {});
          io.emit("last:users", clients[io.name]);
          io.to(socket.id).emit(
            "register",
            clients[io.name]?.onlines[socket.id]
          );
        }
      }
      break;
    case "message":
      if (payload) {
        io.to(payload.dest?.uuid)
          .to(payload.dest?.phone)
          .to(payload.room)
          .to(payload.company)
          .to(socket.id)
          .to("master")
          .emit("message", payload);
      }
      break;
    case "private:message":
      if (payload) {
        io.to(payload.dest?.uuid)
          .to(payload.dest?.phone)
          .to(payload.company)
          .to(socket.id)
          .to("master")
          .emit("message", payload);
      }
      break;
    case "join":
      if (payload?.room) {
        socket.join(payload.room);
        io.to(payload.room)
          .to(socket.id)
          .to("master")
          .emit("join", { uuid: socket.id, room: payload.room });
      }
      break;
    case "leave":
      if (payload?.room) {
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
      Log(`client:${socket.id} left connection`);
      if (clients) delete clients[io.name]["onlines"][socket.id];
      clients[io.name]["count"] = io.sockets.size;
      io.emit("left", { uuid: socket.id });
      io.emit("last:users", clients[io.name]);
      break;
    default:
      break;
  }
};
