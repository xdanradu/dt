function run() {
    new Vue(
        {
        el: '#login-component',
        data: {
            user: '',
            pass: '',
            message: ''
        },
        created: function() {
            console.log('lifecycle hook');
        },
        methods: {
            login: function() {
                if (this.user === 'root' && this.pass === 'pass') {
                    this.message  = 'ALLOW';
                    location.href = "update.html";
                } else {
                    this.message = 'DENY';
                    location.href = "deny.html";
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    run();
});


class User {
    name = '';

    constructor(n) {
        this.name = n;
    }
}

let u1 = new User('root');

console.log(typeof u1);

