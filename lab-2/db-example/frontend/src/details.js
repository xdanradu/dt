function run() {
    new Vue({
      el: '#details',
      data: {
        id: '',
        user: {}
      },
      created: function () {

        let uri = window.location.search.substring(1);
        let params = new URLSearchParams(uri);
        this.id = params.get("id");
        console.log(this.id);

        axios.get('http://localhost:3000/users/'+this.id).then(
            (response) => {
                this.user = response.data[0];
            }
        );
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    run();
  });
  