new Vue({
    el: '#app',
    data: {
        maxRequests: 5,
        windowSec: 60,
        used: 0,
        remaining: 5,
        blocked: false,
        retryAfter: 0,
        retryTimer: null,
        log: []
    },
    created: function () {
        // Load server config on start
        var self = this;
        fetch('/api/config')
            .then(function (r) { return r.json(); })
            .then(function (c) {
                self.maxRequests = c.maxRequests;
                self.windowSec = c.windowMs / 1000;
                self.remaining = c.maxRequests;
            });
    },
    computed: {
        quotaPct: function () {
            return Math.min(100, (this.used / this.maxRequests) * 100);
        },
        quotaColor: function () {
            if (this.used >= this.maxRequests) return '#e74c3c';
            if (this.used >= this.maxRequests - 1) return '#e67e22';
            return '#27ae60';
        }
    },
    methods: {
        // Send a single API request and observe the rate-limit headers
        sendRequest: function () {
            var self = this;
            fetch('/api/resource')
                .then(function (res) {
                    // Read rate-limit headers that the server sets
                    var limit = parseInt(res.headers.get('X-RateLimit-Limit')) || self.maxRequests;
                    var rem = parseInt(res.headers.get('X-RateLimit-Remaining'));
                    self.remaining = isNaN(rem) ? 0 : rem;
                    self.maxRequests = limit;

                    return res.json().then(function (body) {
                        return { status: res.status, body: body };
                    });
                })
                .then(function (result) {
                    var entry = {
                        time: new Date().toLocaleTimeString(),
                        status: result.status,
                        remaining: self.remaining
                    };

                    if (result.status === 429) {
                        // 429 Too Many Requests — server is blocking us
                        entry.message = 'BLOCKED — ' + result.body.message;
                        self.blocked = true;
                        self.retryAfter = result.body.retryAfter;
                        self.startCountdown();
                    } else {
                        entry.message = 'OK — value: ' + result.body.data.value;
                        self.blocked = false;
                    }

                    self.used = self.maxRequests - self.remaining;
                    self.log.unshift(entry);
                    if (self.log.length > 30) self.log.pop();
                });
        },

        // Rapid-fire 8 requests to intentionally trigger rate limiting.
        // This demonstrates what happens when a client exceeds the limit.
        spam: function () {
            var self = this;
            var count = 0;
            function fire() {
                if (count >= 8) return;
                self.sendRequest();
                count++;
                setTimeout(fire, 150);
            }
            fire();
        },

        // Countdown timer showing when the rate limit window resets
        startCountdown: function () {
            var self = this;
            if (this.retryTimer) clearInterval(this.retryTimer);
            this.retryTimer = setInterval(function () {
                self.retryAfter--;
                if (self.retryAfter <= 0) {
                    clearInterval(self.retryTimer);
                    self.retryTimer = null;
                    self.blocked = false;
                    self.used = 0;
                    self.remaining = self.maxRequests;
                }
            }, 1000);
        },

        // Tell the server to clear all rate limits
        resetLimits: function () {
            var self = this;
            fetch('/api/reset', { method: 'POST' })
                .then(function () {
                    self.used = 0;
                    self.remaining = self.maxRequests;
                    self.blocked = false;
                    self.retryAfter = 0;
                    if (self.retryTimer) clearInterval(self.retryTimer);
                    self.log.unshift({
                        time: new Date().toLocaleTimeString(),
                        status: 'RST',
                        message: 'Rate limits cleared',
                        remaining: self.maxRequests
                    });
                });
        },

        // Update server config when the student changes limit/window
        updateConfig: function () {
            var self = this;
            fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    maxRequests: parseInt(this.maxRequests),
                    windowMs: parseInt(this.windowSec) * 1000
                })
            }).then(function (r) { return r.json(); })
                .then(function (c) {
                    self.maxRequests = c.maxRequests;
                    self.windowSec = c.windowMs / 1000;
                    self.used = 0;
                    self.remaining = c.maxRequests;
                    self.blocked = false;
                });
        }
    }
});
