const serverAddress = `ws://${window.location.hostname}:${window.location.port}`;
const socket = io(serverAddress);
console.log("Socket on ", serverAddress, ": ", socket)

socket.on('connect', () => {
  console.log('Socket connected');

  socket.on('message', SocketServer.process);

  const messageToSend = 'Hello Server!';
  socket.emit('message', {type: 'message'})
  socket.emit('chat', {type: 'chat'});
});

socket.on('response', (message) => {
  console.log('Message from server:', message);
  // Process the message received from the server
  const processedMessage = processMessage(message);
//   console.log('Processed message:', processedMessage);

  // Close the socket connection
  socket.disconnect();
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

function processMessage(message) {
  // Add your logic to process the message here
  const processedMessage = message.toLowerCase();
  return processedMessage;
}

class SocketServer {
    constructor() {

    }

    static process(payload) {
        var message = payload.message;
        if(message.player) {
            if(activePlayer != message.player) {
                var p = players[message.player].body.position;
                console.log("Active", activePlayer, " - setting ", message.player, " from ", p,"to ", message.position.x);
                Matter.Body.setPosition(players[message.player].body, message.position);
            }

        }
    }   

    static send(messageType, data) {
        // console.log("Emitting ", messageType, data)
        socket.emit(messageType, data);
    }
}