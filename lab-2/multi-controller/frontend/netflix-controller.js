function runNetflix() {
    new Vue(
        {
        el: '#netflix-component',
        data: {
            movies: [
                {
                  id: 1,
                  title: "Cars"
                },
                {
                  id: 2,
                  title: "Minions",
                },
                {
                    id: 3,
                    title: "O seara in Bucuresti",
                  }
            ]
        },
        created: function() {
            console.log(this.movies);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    runNetflix();
});

