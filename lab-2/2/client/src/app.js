function run() {
  new Vue({
    el: '#app',
    data: {
      users: []
    },
    created: function () {
      this.getUsers().then(response => (this.users = response.data));
    },
    methods: {
      getUsers: function() {
          return axios.get('http://localhost:3000/users');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  run();
});
