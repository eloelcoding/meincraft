const serverAddress = `ws://${window.location.hostname}:${window.location.port}`;

//const serverAddress = `ws://${window.location.hostname}:${window.location.port}/ws/socket.io`;
const socket = io(serverAddress);
console.log("Socket on ", serverAddress, ": ", socket)

socket.on('connect', () => {
  console.log('Socket connected');

  const messageToSend = 'Hello Server!';
  socket.emit('message', {type: 'message'})
  // Send a message to the server
  socket.emit('chat', {type: 'chat'});
});

socket.on('response', (message) => {
  console.log('Message from server:', message);
  // Process the message received from the server
  const processedMessage = processMessage(message);
  console.log('Processed message:', processedMessage);

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