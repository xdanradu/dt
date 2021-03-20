function run() {
    new Vue({
        el: '#app',
        data: {
            message: '',
            users: []
        },
        created: function() {
            this.getUsers();
        },
        methods: {
            deleteUser: function(id) {
                axios.delete(`http://localhost:3000/users/${id}`).then( response => {
                    this.getUsers(); // read from backend
                    // this.users = this.users.filter( item => item.id !== id); // UI
                });
            },
            getUsers() {
                axios.get('http://localhost:3000/users').then( response => {
                    this.users = response.data;
                });
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    run();
});
