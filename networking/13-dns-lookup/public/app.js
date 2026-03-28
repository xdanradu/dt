new Vue({
    el: '#app',
    data: {
        domain: 'google.com',
        result: null,
        loading: false,
        presetDomains: ['google.com', 'github.com', 'utcluj.ro', 'stackoverflow.com', 'wikipedia.org', 'cloudflare.com'],
        // DNS record type explanations for display
        typeInfo: {
            A: 'IPv4 address — where to find this server on the internet',
            AAAA: 'IPv6 address — 128-bit next-generation IP addresses',
            MX: 'Mail servers — where to deliver email for this domain',
            NS: 'Name servers — authoritative DNS servers for this domain',
            TXT: 'Text records — email auth (SPF/DKIM), domain verification',
            CNAME: 'Alias — this name is actually another domain name'
        }
    },
    methods: {
        lookup: function () {
            if (!this.domain.trim()) return;
            this.loading = true;
            this.result = null;
            var self = this;
            fetch('/api/dns/' + encodeURIComponent(this.domain.trim()))
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    self.result = data;
                    self.loading = false;
                })
                .catch(function () { self.loading = false; });
        },
        tryDomain: function (d) {
            this.domain = d;
            this.lookup();
        },
        // Check if a record type has any results
        hasRecords: function (type) {
            return this.result && this.result.records[type] && this.result.records[type].length > 0;
        },
        // Format MX records which have priority + exchange fields
        formatRecord: function (type, record) {
            if (type === 'MX') return record.priority + '  ' + record.exchange;
            return String(record);
        }
    }
});
