// Vue instance — the core of Vue's reactivity system.
// 'el' binds this instance to the #app DOM element.
// Any property in 'data' becomes reactive: when its value changes,
// Vue automatically re-renders all template expressions that reference it.
// This is the Observer pattern — no manual DOM manipulation needed.
new Vue({
    el: '#app',
    data: { message: '', history: [] },
    methods: {
        save: function () {
            // trim() prevents saving empty/whitespace-only strings.
            if (this.message.trim()) {
                // Vue detects array mutations (push, splice, etc.) and updates the DOM.
                // Direct index assignment (arr[0] = x) would NOT trigger reactivity.
                this.history.push(this.message);
                // Clearing the model immediately updates the input field (two-way binding via v-model).
                this.message = '';
            }
        }
    }
});
