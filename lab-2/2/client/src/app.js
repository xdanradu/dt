var app = new Vue({
    el: '#app',
    data: {
        users: [],
        usersService: null
    },
    created: function () {
        this.usersService = users();
        this.usersService.get().then(response => (this.users = response.data));
    },
    methods: {
    }
})