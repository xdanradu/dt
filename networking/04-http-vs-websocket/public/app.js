// WebSocket connection — stays open for the entire session.
var socket = io();

new Vue({
    el: '#app',
    data: {
        httpCounter: 0, wsCounter: 0,
        httpRequestCount: 0, wsMessageCount: 0,
        polling: false, pollInterval: 1000, pollTimer: null,
        httpFlash: false, wsFlash: false
    },
    created: function () {
        var self = this;
        // WebSocket side: the server pushes 'counter' events instantly when data changes.
        // No request needed — the data arrives as soon as it's available.
        socket.on('counter', function (data) {
            self.wsCounter = data.counter;
            self.wsMessageCount++;
            // Flash animation trick: set false then true in next tick
            // to force Vue to re-trigger the CSS animation class.
            self.wsFlash = false;
            self.$nextTick(function () { self.wsFlash = true; });
        });
    },
    methods: {
        // Sends a WebSocket event to the server. The server increments the counter
        // and broadcasts the new value to all clients — including this one.
        increment: function () {
            socket.emit('increment');
        },
        // Toggle HTTP polling on/off. When active, setInterval fires a GET request
        // every pollInterval ms, regardless of whether the data actually changed.
        // This is the fundamental inefficiency of polling vs push.
        togglePolling: function () {
            if (this.polling) {
                clearInterval(this.pollTimer);
                this.polling = false;
            } else {
                this.polling = true;
                this.poll(); // Fire immediately, don't wait for first interval
                var self = this;
                this.pollTimer = setInterval(function () { self.poll(); }, this.pollInterval);
            }
        },
        // Raw XMLHttpRequest used intentionally (instead of axios) to show
        // what HTTP requests look like at a lower level.
        // Each poll creates a new TCP connection, sends HTTP headers (~200 bytes),
        // and receives the response — even if the counter hasn't changed.
        poll: function () {
            var self = this;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/api/counter');
            xhr.onload = function () {
                var data = JSON.parse(xhr.responseText);
                self.httpCounter = data.counter;
                self.httpRequestCount++;
                self.httpFlash = false;
                self.$nextTick(function () { self.httpFlash = true; });
            };
            xhr.send();
        }
    }
});
