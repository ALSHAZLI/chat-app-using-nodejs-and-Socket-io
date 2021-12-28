const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const os = require("os");
const cluster = require("cluster");

const numCpu = os.cpus().length;

console.log(numCpu);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/as.html");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  server.listen(process.env.PORT || 5000, () => {
    console.log("Backend server running on port 5000");
    console.log(`Worker ${process.pid} started`);
  });
}
