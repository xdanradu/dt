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
           globalMessages$.pipe(
            rxjs.map( entries =>
                entries.map((e) => `Message:${e.message}`)
            )
           ).subscribe(messages=>this.messages = messages);
        },
        methods: {
            send: function() {
                socket.emit('chat', this.message);
            }
        }
    }
);