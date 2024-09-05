let rooms = {};

exports.joinRoom = (req, res) => {
  const roomId = req.body.roomId;
  if (!rooms[roomId]) {
    rooms[roomId] = [];
  }
  rooms[roomId].push(req.socket);
  req.socket.join(roomId);
  res.send(`Joined room ${roomId}`);
};

exports.sendMessage = (req, res) => {
  const roomId = req.body.roomId;
  const message = req.body.message;
  if (rooms[roomId]) {
    rooms[roomId].forEach((socket) => {
      socket.emit('newMessage', message);
    });
  }
  res.send(`Message sent to room ${roomId}`);
};