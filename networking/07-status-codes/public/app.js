new Vue({
    el: '#app',
    data: {
        codeInput: '200',
        result: null,
        error: '',
        // Common status codes for quick-access buttons
        quickCodes: [200, 201, 204, 301, 302, 304, 400, 401, 403, 404, 405, 418, 429, 500, 502, 503]
    },
    created: function () {
        this.sendCode();
    },
    methods: {
        sendCode: function () {
            var code = this.codeInput.trim();
            if (!code) return;
            this.error = '';
            this.result = null;
            var self = this;
            // fetch() returns the Response object which includes .status —
            // this is the HTTP status code sent by the server.
            // We read both the status and the JSON body to display them.
            fetch('/api/status/' + code)
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    if (data.error) {
                        self.error = data.error;
                    } else {
                        self.result = data;
                    }
                })
                .catch(function () { self.error = 'Request failed'; });
        },
        tryCode: function (code) {
            this.codeInput = String(code);
            this.sendCode();
        },
        // Maps category names to CSS class names for color coding
        catClass: function (cat) {
            if (!cat) return '';
            if (cat === 'Success') return 'cat-success';
            if (cat === 'Redirection') return 'cat-redirect';
            if (cat === 'Client Error') return 'cat-client';
            if (cat === 'Server Error') return 'cat-server';
            return 'cat-info';
        },
        codeColor: function (code) {
            if (code < 300) return '#27ae60';
            if (code < 400) return '#667eea';
            if (code < 500) return '#e67e22';
            return '#e74c3c';
        }
    }
});
