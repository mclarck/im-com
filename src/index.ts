import * as SocketIO from "socket.io";
import * as express from "express";
import * as path from "path";
import Log from "./lib/log";
import { reduce } from "./reducer";
const app = express();
const http = require('http');
const fs = require('fs');
const options = { key: fs.readFileSync('.conf/key.pem'), cert: fs.readFileSync('.conf/cert.pem') };
const server = http.Server(app);
const io = require("socket.io")(server, { cors: { origin: '*' }, transports: ['polling'] });
app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./public/index.html"));
});
const clients: any = {};
const scope = io.of(new RegExp(`^\/\.+$`).compile());
scope.on("connection", (socket: SocketIO.Socket) => {
  const namespace = socket.nsp;
  try {
    reduce(socket, namespace, "connection", null, clients);
  } catch (e) {
    Log(e.message);
  }
  //----------------
  socket.on("disconnect", () => {
    try {
      reduce(socket, namespace, "disconnect", null, clients);
    } catch (e) {
      Log(e.message);
    }
  });
  //----------------
  socket.on("close", () => {
    try {
      reduce(socket, namespace, "close", null, clients);
    } catch (e) {
      Log(e.message);
    }
  });
  //************ */
  socket.on("message", (payload: any) => {
    try {
      reduce(socket, namespace, "message", payload);
    } catch (e) {
      Log(e.message);
    }
  });
  //************ */
  socket.on("register", (payload: any) => {
    try {
      reduce(socket, namespace, "register", payload, clients);
    } catch (e) {
      Log(e.message);
    }
  });
  //************ */
  socket.on("private:message", (payload: any) => {
    try {
      reduce(socket, namespace, "private:message", payload);
    } catch (e) {
      Log(e.message);
    }
  });
  //************ */
  socket.on("join", (payload: any) => {
    try {
      reduce(socket, namespace, "join", payload);
    } catch (e) {
      Log(e.message);
    }
  });
  //************ */
  socket.on("leave", (payload: any) => {
    try {
      reduce(socket, namespace, "leave", payload);
    } catch (e) {
      Log(e.message);
    }
  });
});
scope.use((socket: any, next: any) => {
  next();
});
server.listen(8080);