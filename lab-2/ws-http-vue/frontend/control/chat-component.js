/* Controller VueJS */
new Vue(
    {
        el: '#chat-component',
        data: {
            socketId: '',
            messages: [],
            message: ''
        },
        created: function(){
           this.socketId = socket.id;
        },
        methods: {
            send: function() {
                socket.emit('chat', this.message);
                this.messages = globalMessages;
            }
        }
    }
);