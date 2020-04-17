function run() {
  new Vue({
    el: '#app',
    data: {
      message: ''
    },
    methods: {
      process: function () {
        console.log('Input string value: ' + this.message);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  run();
});
