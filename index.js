const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/as.html");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit('chat message', msg);
  });
});
server.listen(process.env.PORT || 5000, () => {
  console.log("Backend server running on port 5000");
});
