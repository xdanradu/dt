new Vue({
    el: '#app',
    data: {
        // Auth state
        loggedIn: false,
        user: null,
        token: null,

        // Login form
        username: '',
        password: '',
        loginError: '',
        loginSteps: null,

        // API response display
        lastResponse: null,
        lastStatus: 0,
        lastEndpoint: ''
    },
    methods: {
        // Quick-fill credentials for demo convenience
        quickLogin: function (user, pass) {
            this.username = user;
            this.password = pass;
        },

        // Authenticate with the server.
        // POST /api/login → server validates creds → creates session → sets cookie.
        login: function () {
            var self = this;
            this.loginError = '';

            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: this.username,
                    password: this.password
                })
            })
                .then(function (res) {
                    return res.json().then(function (body) {
                        return { status: res.status, body: body };
                    });
                })
                .then(function (result) {
                    if (result.status === 200) {
                        self.loggedIn = true;
                        self.user = result.body.user;
                        self.token = result.body.token;
                        self.loginSteps = result.body.explanation;
                        self.lastResponse = result.body;
                        self.lastStatus = 200;
                        self.lastEndpoint = 'POST /api/login';
                    } else {
                        self.loginError = result.body.error;
                    }
                });
        },

        // Destroy the session — server deletes token, clears cookie.
        logout: function () {
            var self = this;
            fetch('/api/logout', { method: 'POST' })
                .then(function (res) { return res.json(); })
                .then(function (body) {
                    self.loggedIn = false;
                    self.user = null;
                    self.token = null;
                    self.loginSteps = null;
                    self.lastResponse = body;
                    self.lastStatus = 200;
                    self.lastEndpoint = 'POST /api/logout';
                    self.username = '';
                    self.password = '';
                });
        },

        // Access a protected endpoint — the cookie is sent automatically.
        // If logged in → 200 with user data.
        // If not logged in → 401 Unauthorized.
        fetchProfile: function () {
            var self = this;
            fetch('/api/profile')
                .then(function (res) {
                    self.lastStatus = res.status;
                    self.lastEndpoint = 'GET /api/profile';
                    return res.json();
                })
                .then(function (body) {
                    self.lastResponse = body;
                });
        },

        // Access admin-only endpoint.
        // If admin → 200 with admin data.
        // If other role → 403 Forbidden (authenticated but not authorized).
        // If not logged in → 401 Unauthorized.
        fetchAdmin: function () {
            var self = this;
            fetch('/api/admin')
                .then(function (res) {
                    self.lastStatus = res.status;
                    self.lastEndpoint = 'GET /api/admin';
                    return res.json();
                })
                .then(function (body) {
                    self.lastResponse = body;
                });
        },

        // Check session state without authentication
        checkSession: function () {
            var self = this;
            fetch('/api/session-info')
                .then(function (res) {
                    self.lastStatus = res.status;
                    self.lastEndpoint = 'GET /api/session-info';
                    return res.json();
                })
                .then(function (body) {
                    self.lastResponse = body;
                });
        },

        statusClass: function () {
            if (this.lastStatus >= 200 && this.lastStatus < 300) return 'status-ok';
            if (this.lastStatus === 403) return 'status-forbidden';
            return 'status-err';
        },

        formatJson: function (obj) {
            return JSON.stringify(obj, null, 2);
        }
    }
});
