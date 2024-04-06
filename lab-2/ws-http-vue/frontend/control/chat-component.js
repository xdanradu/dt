/* Controller VueJS */
var globalMessages = [];

new Vue(
    {
        el: '#chat-component',
        data: {
            socketId: '',
            messages: [],
            message: '',
            socket: null
        },
        created: function(){
            try {
                this.socket = io.connect('localhost:8000');

                this.socket.on('connect', function () {
                    console.log('Connect');    
                });
              
                this.socket.on('message-from-server', function (entry) {
                    globalMessages.push(entry);
                    // console.log(globalMessages);
                });
              } catch (err) {
                console.log('ERROR: socket.io encountered a problem:\n', err);
              }
        },
        methods: {
            send: function() {
                this.socket.emit('chat', this.message);
                this.messages = globalMessages;
            }
        }
    }
);