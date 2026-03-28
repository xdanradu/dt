var socket = io();

new Vue({
    el: '#app',
    data: {
        question: '',
        options: [],
        votes: [],
        totalVoters: 0,
        onlineCount: 0,
        myVote: -1
    },
    created: function () {
        var self = this;
        socket.on('poll-state', function (data) {
            self.question = data.question;
            self.options = data.options;
            self.votes = data.votes;
            self.totalVoters = data.totalVoters;
        });
        // Real-time vote updates from the server — no polling needed.
        // Every time anyone votes, all clients see the bars move instantly.
        socket.on('votes-updated', function (data) {
            self.votes = data.votes;
            self.totalVoters = data.totalVoters;
        });
        socket.on('online-count', function (n) { self.onlineCount = n; });
    },
    methods: {
        vote: function (index) {
            this.myVote = index;
            socket.emit('vote', index);
        },
        // Calculate the total number of votes across all options
        totalVotes: function () {
            var sum = 0;
            for (var i = 0; i < this.votes.length; i++) sum += this.votes[i];
            return sum;
        },
        // Percentage for bar width — returns 0 if no votes yet to avoid NaN
        pct: function (i) {
            var total = this.totalVotes();
            if (total === 0) return 0;
            return Math.round(this.votes[i] / total * 100);
        }
    }
});
