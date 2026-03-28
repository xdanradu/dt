new Vue({
    el: '#app',
    data: {
        delay: 100,
        lastResult: null,
        waiting: false,
        history: [],
        // Real-world latency examples for context
        presets: [
            { label: 'Localhost (0ms)', value: 0 },
            { label: 'Same city (5ms)', value: 5 },
            { label: 'Same country (30ms)', value: 30 },
            { label: 'Europe ↔ US (100ms)', value: 100 },
            { label: 'EU ↔ Japan (250ms)', value: 250 },
            { label: 'Satellite (600ms)', value: 600 },
            { label: 'Mars (4 min)', value: 3000 }
        ]
    },
    computed: {
        // Maps the current delay to a real-world scenario description
        scenario: function () {
            if (this.delay === 0) return 'Localhost — same machine, no network';
            if (this.delay <= 5) return 'Same data center or local network';
            if (this.delay <= 30) return 'Same country — a few routing hops';
            if (this.delay <= 100) return 'Cross-continent — fiber through the ocean floor';
            if (this.delay <= 300) return 'Opposite side of the planet — speed of light limit';
            if (this.delay <= 700) return 'Geostationary satellite — 36,000 km altitude';
            return 'Interplanetary — electromagnetic wave travel time';
        },
        delayColor: function () {
            if (this.delay <= 30) return '#2ecc71';
            if (this.delay <= 150) return '#e67e22';
            return '#e74c3c';
        }
    },
    methods: {
        ping: function () {
            this.waiting = true;
            this.lastResult = null;
            var start = Date.now();
            var self = this;
            // Measures round-trip time: client → server → client.
            // The server adds artificial delay to simulate physical distance.
            // The actual measured time will be slightly higher than requested
            // due to real network overhead (TCP, HTTP headers, processing).
            fetch('/api/ping?delay=' + this.delay)
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    var rtt = Date.now() - start;
                    self.lastResult = { rtt: rtt, requested: data.requestedDelay };
                    self.history.unshift({ delay: self.delay, rtt: rtt });
                    if (self.history.length > 10) self.history.pop();
                    self.waiting = false;
                });
        },
        setPreset: function (value) {
            this.delay = value;
        }
    }
});
