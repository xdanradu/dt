// io() connects to the Socket.IO server that served this page.
// This opens a persistent WebSocket connection (upgraded from HTTP).
// Unlike HTTP, this connection stays open for bidirectional messaging.
var socket = io();

new Vue({
    el: '#app',
    data: {
        username: '', editName: '', myColor: '#888',
        draft: '', messages: [],
        onlineCount: 0, typingText: '', typingTimer: null
    },
    created: function () {
        var self = this;
        // 'welcome' is a custom event sent by the server when this client connects.
        // The server assigns a random name and color — no registration needed.
        socket.on('welcome', function (data) {
            self.username = data.name;
            self.editName = data.name;
            self.myColor = data.color;
            self.onlineCount = data.online;
        });
        // Server broadcasts updated count whenever someone joins/leaves.
        socket.on('online-count', function (n) { self.onlineCount = n; });
        // System messages (join/leave/rename) are pushed from the server.
        // No client polling — the server decides when to notify.
        socket.on('system', function (text) {
            self.messages.push({ type: 'system', text: text });
            self.scroll();
        });
        // Incoming chat message — the server broadcasts to all clients including sender.
        // We add a formatted timestamp for display.
        socket.on('chat-message', function (msg) {
            msg.type = 'chat';
            msg.timeStr = new Date(msg.time).toLocaleTimeString().slice(0, 5);
            self.messages.push(msg);
            self.scroll();
            self.typingText = '';
        });
        // Typing indicator — debounced with a 1.5s timeout.
        // If no new 'typing' event arrives within 1.5s, the indicator disappears.
        // clearTimeout prevents stale timers from hiding a fresh indicator too early.
        socket.on('typing', function (who) {
            self.typingText = who + ' is typing...';
            clearTimeout(self.typingTimer);
            self.typingTimer = setTimeout(function () { self.typingText = ''; }, 1500);
        });
    },
    methods: {
        // socket.emit() sends data to the server over the open WebSocket.
        // No HTTP request is created — just a lightweight WebSocket frame.
        send: function () {
            if (!this.draft.trim()) return;
            socket.emit('chat-message', this.draft);
            this.draft = '';
        },
        changeName: function () {
            if (this.editName.trim() && this.editName !== this.username) {
                this.username = this.editName.trim();
                socket.emit('set-name', this.username);
            }
        },
        emitTyping: function () { socket.emit('typing'); },
        // $nextTick waits for Vue to finish re-rendering the DOM after data changes.
        // Without it, scrollHeight wouldn't reflect the newly added message element.
        scroll: function () {
            var self = this;
            this.$nextTick(function () { self.$refs.messages.scrollTop = self.$refs.messages.scrollHeight; });
        }
    }
});
