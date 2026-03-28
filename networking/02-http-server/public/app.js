// Decorator pattern: wraps axios to intercept every HTTP request/response
// and log timing + status to the Vue data model. This lets the UI show a
// live request log without modifying any of the actual API call logic.
function loggedAxios(vm) {
    function wrap(method, url, data) {
        var start = Date.now();
        var time = new Date().toLocaleTimeString().slice(0, 8);
        // Conditionally pass 'data' — GET/DELETE have no body, POST does.
        var promise = data !== undefined ? axios[method](url, data) : axios[method](url);
        return promise.then(function (r) {
            // unshift() adds to the beginning of the array so newest logs appear first.
            vm.logs.unshift({ time: time, method: method.toUpperCase(), url: url, ms: Date.now() - start, ok: true });
            // Return the response so the calling code can chain .then() normally.
            return r;
        }).catch(function (e) {
            vm.logs.unshift({ time: time, method: method.toUpperCase(), url: url, ms: Date.now() - start, ok: false });
            // Re-throw so errors still propagate to the caller.
            throw e;
        });
    }
    return {
        get: function (url) { return wrap('get', url); },
        post: function (url, data) { return wrap('post', url, data); },
        put: function (url, data) { return wrap('put', url, data); },
        delete: function (url) { return wrap('delete', url); }
    };
}

new Vue({
    el: '#app',
    data: {
        users: [], newName: '', newCity: '',
        logs: [], slowResult: '', http: null
    },
    // 'created' lifecycle hook runs once when the Vue instance is initialized,
    // before the component is mounted to the DOM. Ideal for data fetching.
    created: function () {
        this.http = loggedAxios(this);
        this.load();
    },
    methods: {
        // GET /api/users — fetches the full list from the server.
        // .bind(this) ensures 'this' refers to the Vue instance inside the callback,
        // because regular functions create their own 'this' context.
        load: function () { this.http.get('/api/users').then(function (r) { this.users = r.data; }.bind(this)); },
        // POST /api/users — sends JSON body. Server returns the updated full list,
        // so we replace the local array (single source of truth on server).
        add: function () {
            if (!this.newName || !this.newCity) return;
            var self = this;
            this.http.put('/api/users', { name: this.newName, city: this.newCity })
                .then(function (r) { self.users = r.data; self.newName = ''; self.newCity = ''; });
        },
        // DELETE /api/users/:index — removes by position. REST convention:
        // the resource identifier is in the URL path, not in a request body.
        remove: function (index) {
            var self = this;
            this.http.delete('/api/users/' + index).then(function (r) { self.users = r.data; });
        },
        // Calls the intentionally slow endpoint to demonstrate async behavior.
        // The UI stays responsive while waiting — no freezing.
        testSlow: function () {
            this.slowResult = 'Waiting...';
            var self = this;
            this.http.get('/api/slow?ms=2000').then(function (r) { self.slowResult = 'Got response: ' + r.data.message; });
        }
    }
});
