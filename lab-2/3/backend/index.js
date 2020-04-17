const io = require('socket.io');
const server = io.listen(8000);
console.log('Server socket is listening on port 8000');
let connectedClients = new Map();

// event fired every time a new client connects
server.on('connection', socket => {
  console.info(`Client connected [id=${socket.id}]`);
  connectedClients.set(socket.id, socket);
  console.log(connectedClients.size + ' client/s connected');

  // when socket disconnects, remove it from the map
  socket.on('disconnect', () => {
    connectedClients.delete(socket.id);
    console.info(`Client [id=${socket.id}] disconnected`);
    console.log(connectedClients.size + ' client/s connected');
  });

  socket.on('chat', payload => {
    sendMessageToAllOtherClients(socket, payload);
  });
});

function sendMessageToAllOtherClients(sender, message) {
  for (let [key, socket] of connectedClients) {
    socket.emit('message-from-server', { id: sender.id, message: message });
  }
}
