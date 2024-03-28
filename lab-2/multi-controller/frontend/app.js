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
                } else {
                    this.message = 'DENY';
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    run();
});


















/*function login() {
    let user = {
        name: '', 
        pass: ''
    };
    const username = document.getElementById('user');
    const password = document.getElementById('pass');
    user = {
        name: username.value, pass: password.value
    };
    if (user.name === 'root' && user.pass === 'pass') {
        document.getElementById('message').innerText = 'ALLOW';
    } else {
        document.getElementById('message').innerText = 'DENY';
    }
}*/