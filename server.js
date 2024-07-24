
const express = require("express");
const http = require("http");
const soketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = soketIo(server);
 // Serve static files from the public directory
 //app.use(express.static('public'));
 
 const PORT = process.env.PORT || 3000;

 app.get('/', (req, res) => {
  res.send('Video Conferencing Server is running');
});
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", (room) => {
    console.log("join room", room);
    socket.join(room);
    socket.to(room).emit("user-joined", socket.id);
  });

  socket.on("signal", (data) => {
    console.log("signal", data);
    socket.to(data.to).emit("signal", {
      from: data.from,
      signal: data.signal,
    });
  });

  socket.on("disconnect", () => {
    console.log(`user left ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
