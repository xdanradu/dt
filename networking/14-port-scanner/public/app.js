new Vue({
    el: '#app',
    data: {
        results: [],
        scanTime: 0,
        scanning: false
    },
    created: function () {
        this.scan();
    },
    computed: {
        openCount: function () {
            return this.results.filter(function (r) { return r.open; }).length;
        },
        closedCount: function () {
            return this.results.filter(function (r) { return !r.open; }).length;
        }
    },
    methods: {
        scan: function () {
            this.scanning = true;
            var self = this;
            // Calls the server to scan common ports on localhost.
            // Each port check is a TCP SYN attempt — if a service is listening,
            // the OS responds with SYN-ACK (open). If not, RST (closed).
            fetch('/api/scan')
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    // Sort: open ports first, then by port number
                    self.results = data.results.sort(function (a, b) {
                        if (a.open !== b.open) return a.open ? -1 : 1;
                        return a.port - b.port;
                    });
                    self.scanTime = data.time;
                    self.scanning = false;
                });
        }
    }
});
