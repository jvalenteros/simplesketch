import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth - 60;
      canvas.height = window.innerHeight;
      redrawCanvas();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    let x, y;
    if (e.type.includes('mouse')) {
      x = e.clientX - canvas.offsetLeft;
      y = e.clientY - canvas.offsetTop;
    } else if (e.type.includes('touch')) {
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    }
    return { x, y };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    setLastPosition(getCoordinates(e));
    saveState();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.stroke();
    setLastPosition({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    saveState();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    setUndoStack((prev) => [...prev, canvas.toDataURL()]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const canvas = canvasRef.current;
      setRedoStack((prev) => [...prev, canvas.toDataURL()]);
      const newUndoStack = [...undoStack];
      const lastState = newUndoStack.pop();
      setUndoStack(newUndoStack);
      redrawCanvas(lastState);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const canvas = canvasRef.current;
      setUndoStack((prev) => [...prev, canvas.toDataURL()]);
      const newRedoStack = [...redoStack];
      const nextState = newRedoStack.pop();
      setRedoStack(newRedoStack);
      redrawCanvas(nextState);
    }
  };

  const redrawCanvas = (imgData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (imgData) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = imgData;
    } else if (undoStack.length > 0) {
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = undoStack[undoStack.length - 1];
    }
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'canvas-drawing.png';
    link.href = dataURL;
    link.click();
  };

  return (
    <div id="app-container">
      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      ></canvas>
      <div id="toolbar">
        <div id="color-picker">
          <input
            type="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div id="brush-size">
          <input
            type="range"
            id="size"
            min="1"
            max="50"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </div>
        <button id="undo" className="tool-button" onClick={undo}>
          <i className="fas fa-undo"></i>
        </button>
        <button id="redo" className="tool-button" onClick={redo}>
          <i className="fas fa-redo"></i>
        </button>
        <button id="clear" className="tool-button" onClick={clearCanvas}>
          <i className="fas fa-trash"></i>
        </button>
        <button id="save" className="tool-button" onClick={saveCanvas}>
          <i className="fas fa-save"></i>
        </button>
      </div>
    </div>
  );
}

export default App;