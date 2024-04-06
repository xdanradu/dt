new Vue(
    {
        el: '#cars-component',
        data: {
            cars: []
        },
        created: function(){
            this.getCars();
        },
        methods: {
            getCars: function(){
                axios.get('http://localhost:3000/cars').then(response => { 
                    this.cars = response.data;
                });
            }
        }
    }
);