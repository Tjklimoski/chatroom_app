import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  createUser,
  findUserById,
  findUsersInRoom,
  removeUser,
} from "./util/user.js";
import { createMsg } from "./util/message.js";

const PORT = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ name, room }) => {
    const user = createUser(socket.id, name, room);
    socket.join(user.room);

    //private welcome to new user
    socket.emit("alert", `Welcome to ${user.room}, enjoy the chat!`);

    //Send the up-to-date user list for the room to everyone.
    io.to(user.room).emit("update-users", findUsersInRoom(user.room));

    //send an alert to all users, except the current socket, that a user has joined the room.
    socket.broadcast
      .to(user.room)
      .emit("alert", `${user.name} has joined the room`);
  });

  //send msg to all connected users in same room
  socket.on("send-msg", (msg) => {
    const user = findUserById(socket.id);
    io.to(user.room).emit("new-msg", createMsg(msg, user.name));
  });

  //disconnect
  socket.on("disconnect", () => {
    //remove the user from the users DB
    const user = removeUser(socket.id);

    if (!user) return;

    //send an alert to all users, except the initiator, that a user has left.
    socket.broadcast
      .to(user.room)
      .emit("alert", `${user.name} has left the room`);

    //Send the updated users for the room.
    io.to(user.room).emit("update-users", findUsersInRoom(user.room));
  });
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
