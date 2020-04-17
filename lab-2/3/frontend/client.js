var socket = io.connect('localhost:8000');

try {
  socket.on('connect', function () {
    document.getElementById('client-id').innerHTML = 'Client id: ' + socket.id;
  });

  socket.on('message-from-server', function (entry) {
    // console.dir(message);
    var messages = document.getElementsByClassName('messages')[0];
    let p = document.createElement('p');
    p.innerText = entry.id + ': ' + entry.message;
    messages.appendChild(p);
  });
} catch (err) {
  alert('ERROR: socket.io encountered a problem:\n\n' + err);
}

document.getElementById('send').addEventListener('click', sendMessage);
function sendMessage() {
  var message = document.getElementById('message').value;
  socket.emit('chat', message);
}
