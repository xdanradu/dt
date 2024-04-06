/* Controller VueJS */
new Vue(
    {
        el: '#login-component',
        data: {
            username: '',
            status: '',
        },
        methods: {
            login: function(){
                let s = '';
                if(this.username === 'root') {
                    s='ALLOW';
                } else {
                    s='DENY';
                }
                this.status = s;
            }
        }
    }
);