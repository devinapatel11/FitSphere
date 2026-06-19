const io = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected");

  socket.emit("joinCommunity", 1);

  socket.emit("sendMessage", {
    communityId: 1,
    userId: 1,
    message: "Hello FitSphere!"
  });
});

socket.on("receiveMessage", (data) => {
  console.log("New Message:", data);
});