new Vue(
    {
        el: '#movies-component',
        data: {
            movies: [],
            resourcesApi: 'http://localhost:3200'
        },
        created: function(){
            this.getMovies();
        },
        methods: {
            getMovies: function(){
                axios.get('http://localhost:3000/movies').then(response => { 
                    this.movies = response.data;
                });
            }
        }
    }
);