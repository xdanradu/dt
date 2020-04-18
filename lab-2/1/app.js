function run() {
  new Vue({
    el: '#app',
    data: {
      message: ''
    },
    methods: {
      doSomething: function () {
        console.log('The input string value is: ' + this.message);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  run();
});
