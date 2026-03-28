new Vue({
    el: '#app',
    data: {
        selectedFile: null,
        result: null,
        uploading: false
    },
    methods: {
        triggerInput: function () {
            this.$refs.fileInput.click();
        },
        onFileSelected: function (e) {
            this.selectedFile = e.target.files[0] || null;
            this.result = null;
        },
        upload: function () {
            if (!this.selectedFile) return;
            this.uploading = true;
            var self = this;

            // FormData is the browser API for building multipart/form-data bodies.
            // This is the same encoding an HTML <form> with enctype="multipart/form-data" uses.
            // It can carry both text fields and binary file data in a single request.
            var formData = new FormData();
            formData.append('file', this.selectedFile);

            // When sending FormData with fetch, do NOT set Content-Type manually.
            // The browser must set it itself to include the boundary string
            // that separates the parts of the multipart body.
            fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    self.result = data;
                    self.uploading = false;
                })
                .catch(function () { self.uploading = false; });
        },
        formatSize: function (bytes) {
            if (bytes < 1024) return bytes + ' B';
            return (bytes / 1024).toFixed(1) + ' KB';
        }
    }
});
