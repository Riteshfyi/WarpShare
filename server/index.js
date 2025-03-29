const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",

  },
});


// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     credentials: true,
//   },
// });

let userIdToSocketId = new Map();
let socketIdToUserId = new Map();

app.use(cors());

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("register", ({ userId, socketId }) => {
    console.log(`Registering User: ${userId} -> ${socketId}`);
    userIdToSocketId.set(userId, socketId);
    socketIdToUserId.set(socketId, userId);
    io.to(socketId).emit("registered", { userId });
  });

  socket.on("signal", ({ signal, to, from }) => {
    const targetSocketId = userIdToSocketId.get(to);
    console.log(`Signal sent from ${from} to ${to} (${targetSocketId})`);

    if (targetSocketId) {
      io.to(targetSocketId).emit("signal", { signal, from });
    }
  });

  socket.on("disconnect", () => {
    const userId = socketIdToUserId.get(socket.id);
    console.log(`User Disconnected: ${userId}`);
    userIdToSocketId.delete(userId);
    socketIdToUserId.delete(socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
