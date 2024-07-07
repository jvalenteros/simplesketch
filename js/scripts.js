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

        function getCoordinates(e) {
            let x, y;
            if (e.type.includes('mouse')) {
                x = e.clientX
                y = e.clientY
            } else if (e.type.includes('touch')) {
                const rect = canvas.getBoundingClientRect();
                x = e.touches[0].clientX - rect.left;
                y = e.touches[0].clientY - rect.top;
            }
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
        
        // Mouse events
        canvas.addEventListener('mousedown', getCoordinates);
        canvas.addEventListener('mousemove', getCoordinates);
        canvas.addEventListener('mouseup', getCoordinates);
        canvas.addEventListener('mouseout', getCoordinates);

        // Touch events
        canvas.addEventListener('touchstart', getCoordinates);
        canvas.addEventListener('touchmove', getCoordinates);
        canvas.addEventListener('touchend', getCoordinates);
        canvas.addEventListener('touchcancel', getCoordinates);
        
        resizeCanvas();