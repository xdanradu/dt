var socket = io();

new Vue({
    el: '#app',
    data: {
        myColor: '#333',
        onlineCount: 0,
        drawing: false,
        lastX: 0,
        lastY: 0,
        brushSize: 3,
        ctx: null
    },
    mounted: function () {
        var canvas = this.$refs.canvas;
        // Canvas must match the visible area pixel-for-pixel to avoid blurry drawing
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 46;
        this.ctx = canvas.getContext('2d');
        this.ctx.lineCap = 'round'; // Smooth rounded line endings

        var self = this;
        window.addEventListener('resize', function () {
            // On resize, we'd lose the drawing — acceptable for a demo
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - 46;
            self.ctx.lineCap = 'round';
        });

        socket.on('welcome', function (data) {
            self.myColor = data.color;
            // Replay all existing strokes so the new user sees the current drawing
            data.strokes.forEach(function (s) { self.drawLine(s); });
        });
        socket.on('online-count', function (n) { self.onlineCount = n; });
        // When another user draws, render their stroke on our canvas
        socket.on('draw', function (data) { self.drawLine(data); });
        socket.on('clear', function () {
            self.ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    },
    methods: {
        getPointer: function (e) {
            var pt = e.touches ? e.touches[0] : e;
            return {
                x: pt.clientX / window.innerWidth * 100,
                y: (pt.clientY - 46) / (window.innerHeight - 46) * 100
            };
        },
        startDraw: function (e) {
            this.drawing = true;
            var p = this.getPointer(e);
            this.lastX = p.x;
            this.lastY = p.y;
        },
        draw: function (e) {
            if (!this.drawing) return;
            var p = this.getPointer(e);
            var x = p.x;
            var y = p.y;
            var stroke = {
                x0: this.lastX, y0: this.lastY,
                x1: x, y1: y,
                color: this.myColor,
                size: this.brushSize
            };
            // Draw locally and broadcast to others
            this.drawLine(stroke);
            socket.emit('draw', stroke);
            this.lastX = x;
            this.lastY = y;
        },
        stopDraw: function () {
            this.drawing = false;
        },
        // Converts percentage coordinates back to pixels for the local canvas size
        drawLine: function (s) {
            var canvas = this.$refs.canvas;
            this.ctx.beginPath();
            this.ctx.strokeStyle = s.color;
            this.ctx.lineWidth = s.size;
            this.ctx.moveTo(s.x0 / 100 * canvas.width, s.y0 / 100 * canvas.height);
            this.ctx.lineTo(s.x1 / 100 * canvas.width, s.y1 / 100 * canvas.height);
            this.ctx.stroke();
        },
        clearCanvas: function () {
            socket.emit('clear');
        }
    }
});
