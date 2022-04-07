var app = new Vue({
  el: '#app',
  data: {
    username: '',
    password: '',
    status: '',
    products: []
  },
  methods: {
    login: function () {
      let url = 'http://localhost:3000/login';
      axios
        .post(url, { username: this.username, password: this.password })
        .then(response => {
          this.status = response.data.status;
          if (this.status === 'ALLOW') {
            // simulate resource loading
            this.products = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];
          }
        });
    }
  }
});
