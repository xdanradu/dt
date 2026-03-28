var socket = io();

new Vue({
    el: '#app',
    data: {
        myName: '',
        myColor: '',
        onlineCount: 0,
        // Object map of other users' cursor positions: { "User-1": { x, y, color }, ... }
        cursors: {}
    },
    created: function () {
        var self = this;
        socket.on('welcome', function (data) {
            self.myName = data.name;
            self.myColor = data.color;
        });
        socket.on('online-count', function (n) { self.onlineCount = n; });

        // Incoming cursor positions from other users.
        // Vue.set() is needed to add new reactive properties to an object —
        // direct assignment (obj[key] = val) wouldn't trigger Vue reactivity.
        socket.on('mouse-move', function (data) {
            self.$set(self.cursors, data.name, { x: data.x, y: data.y, color: data.color });
        });

        // Remove the cursor when a user disconnects
        socket.on('user-left', function (name) {
            self.$delete(self.cursors, name);
        });
    },
    methods: {
        // Sends cursor position as a percentage of window size (0-100).
        // Using percentages instead of pixels ensures cursors appear in the
        // same relative position regardless of each user's screen resolution.
        onMouseMove: function (e) {
            var x = (e.clientX / window.innerWidth) * 100;
            var y = ((e.clientY - 50) / (window.innerHeight - 50)) * 100;
            socket.emit('mouse-move', { x: x, y: y });
        }
    }
});
