new Vue({
    el: '#app',
    data: {
        connected: false,
        clock: '--:--:--',
        clockIso: '',
        cpuPct: '0',
        memPct: '0',
        memUsed: '0',
        memTotal: '0',
        uptime: 0,
        platform: '',
        hostname: '',
        logs: [],
        eventCount: 0,
        eventSource: null   // reference to the browser's EventSource object
    },
    created: function () {
        this.connect();
    },
    computed: {
        uptimeStr: function () {
            var s = this.uptime;
            var d = Math.floor(s / 86400);
            var h = Math.floor((s % 86400) / 3600);
            var m = Math.floor((s % 3600) / 60);
            return d + 'd ' + h + 'h ' + m + 'm';
        }
    },
    methods: {
        connect: function () {
            var self = this;

            // EventSource is the browser's built-in SSE client.
            // It automatically:
            //   1. Opens an HTTP GET to the given URL
            //   2. Keeps the connection open
            //   3. Parses incoming "data:" lines into events
            //   4. Reconnects automatically if the connection drops
            this.eventSource = new EventSource('/api/stream');

            // Named events are dispatched by the "event:" field in the SSE stream.
            // e.g., "event: clock\ndata: {...}\n\n" fires the 'clock' event handler.
            this.eventSource.addEventListener('connected', function (e) {
                self.connected = true;
                self.eventCount++;
            });

            this.eventSource.addEventListener('clock', function (e) {
                var data = JSON.parse(e.data);
                self.clock = data.time;
                self.clockIso = data.iso;
                self.eventCount++;
            });

            this.eventSource.addEventListener('stats', function (e) {
                var data = JSON.parse(e.data);
                self.cpuPct = data.cpuPct;
                self.memPct = data.memPct;
                self.memUsed = data.memUsed;
                self.memTotal = data.memTotal;
                self.uptime = data.uptime;
                self.platform = data.platform;
                self.hostname = data.hostname;
                self.eventCount++;
            });

            this.eventSource.addEventListener('log', function (e) {
                var data = JSON.parse(e.data);
                // Keep only last 50 logs to avoid DOM bloat
                self.logs.unshift(data);
                if (self.logs.length > 50) self.logs.pop();
                self.eventCount++;
            });

            // onerror fires when the connection drops.
            // EventSource will automatically retry after ~3 seconds.
            this.eventSource.onerror = function () {
                self.connected = false;
            };
        },

        disconnect: function () {
            if (this.eventSource) {
                // .close() terminates the SSE connection.
                // Unlike WebSocket, the browser won't auto-reconnect after close().
                this.eventSource.close();
                this.eventSource = null;
                this.connected = false;
            }
        },

        toggle: function () {
            if (this.connected) {
                this.disconnect();
            } else {
                this.connect();
            }
        },

        cpuColor: function () {
            var v = parseFloat(this.cpuPct);
            if (v > 80) return '#e74c3c';
            if (v > 50) return '#e67e22';
            return '#27ae60';
        },

        memColor: function () {
            var v = parseFloat(this.memPct);
            if (v > 85) return '#e74c3c';
            if (v > 60) return '#e67e22';
            return '#2980b9';
        }
    },
    beforeDestroy: function () {
        this.disconnect();
    }
});
