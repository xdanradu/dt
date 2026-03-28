// Vue app that fetches and displays the raw HTTP request details
// the browser sent to the server. Makes invisible HTTP mechanics visible.
new Vue({
    el: '#app',
    data: {
        info: null,
        loading: false
    },
    created: function () {
        this.inspect();
    },
    methods: {
        inspect: function () {
            this.loading = true;
            var self = this;
            // Simple fetch to our inspection endpoint.
            // The browser automatically attaches headers like User-Agent,
            // Accept, Accept-Language, etc. — we just read them on the server.
            fetch('/api/inspect')
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    self.info = data;
                    self.loading = false;
                });
        }
    }
});
