function run() {
  new Vue({
    el: '#app',
    data: {
      users: [],
      usersService: null,
      message: ''
    },
    created: function () {
      this.usersService = users();
      this.usersService.get().then(response => (this.users = response.data));
    },
    methods: {
      deleteUser: function(index) {
        console.log('HTTP DELETE spre backend, user: '+index);
        this.usersService.remove(index).then(response => {
          this.usersService.get().then(response => (this.users = response.data));  
        });
      },
      goTo: function(index) {
          window.open("details.html?id="+index, "_self");
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  run();
});
