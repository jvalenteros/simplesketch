/* Full-page canvas drawing script */
const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const colorPicker = document.getElementById('color');
        const sizePicker = document.getElementById('size');
        const clearButton = document.getElementById('clear');

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function startDrawing(e) {
            isDrawing = true;
            [lastX, lastY] = [e.clientX, e.clientY];
        }

        function draw(e) {
            if (!isDrawing) return;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.clientX, e.clientY);
            ctx.strokeStyle = colorPicker.value;
            ctx.lineWidth = sizePicker.value;
            ctx.lineCap = 'round';
            ctx.stroke();
            [lastX, lastY] = [e.clientX, e.clientY];
        }

        function stopDrawing() {
            isDrawing = false;
        }

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        clearButton.addEventListener('click', clearCanvas);

        resizeCanvas();