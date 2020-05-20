function run() {
    new Vue({
      el: '#details',
      data: {
        index: 'default',
        user: {}
      },
      created: function () {

        let uri = window.location.search.substring(1);
        let params = new URLSearchParams(uri);
        this.index = params.get("id");

        axios.get('http://localhost:3000/users/'+this.index).then(
            (response) => {
                this.user = response.data;
            }
        );
      },
      methods: {

      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    run();
  });
  