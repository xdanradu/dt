function run() {
    new Vue({
      el: '#update',
      data: {
        id: '',
        message: '',
        car: {}
      },
      created: function () {

        let uri = window.location.search.substring(1);
        let params = new URLSearchParams(uri);
        this.id = params.get("id");

        axios.get('http://localhost:3000/cars/'+this.id).then(
            (response) => {
                this.car = response.data;
            }
        );
      },
      methods: {
        update: function(){
            console.dir(this.car);

            return axios.post('http://localhost:3000/cars', this.car).then(
                (response) => {
                    this.message = response.data; // saved
                }
            );


        }
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    run();
  });
  