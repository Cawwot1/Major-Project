import React, { useEffect, useRef } from 'react';
import '../../styles/main.css'

class Snake {
  constructor(x, y) {
    this.body = [{ x, y }];
    this.direction = { x: 1, y: 0 }; // right
    this.nextDirection = { x: 1, y: 0 };
  }

  setDirection(newDir) {
    const { x, y } = this.direction;
    // Prevent reverse direction
    if (newDir.x === -x && newDir.y === -y) return;
    this.nextDirection = newDir;
  }

  move() {
    this.direction = this.nextDirection;
    const head = { ...this.body[0] };
    head.x += this.direction.x;
    head.y += this.direction.y;
    this.body.unshift(head);
    return this.body.pop(); // remove tail
  }

  grow() {
    const tail = this.body[this.body.length - 1];
    this.body.push({ ...tail });
  }

  hitsItself() {
    const [head, ...rest] = this.body;
    return rest.some(seg => seg.x === head.x && seg.y === head.y);
  }

  getHead() {
    return this.body[0];
  }
}

class Food {
  constructor(gridSize, tileCount) {
    this.gridSize = gridSize;
    this.tileCount = tileCount;
    this.x = 10;
    this.y = 10;
  }

  reposition(snakeBody) {
    let newX, newY, overlaps;
    do {
      newX = Math.floor(Math.random() * this.tileCount);
      newY = Math.floor(Math.random() * this.tileCount);
      overlaps = snakeBody.some(seg => seg.x === newX && seg.y === newY);
    } while (overlaps);
    this.x = newX;
    this.y = newY;
  }
}

class Game {
  constructor(ctx, gridSize = 20, tileCount = 30) {
    this.ctx = ctx;
    this.gridSize = gridSize;
    this.tileCount = tileCount;
    this.snake = new Snake(10, 10);
    this.food = new Food(gridSize, tileCount);
    this.food.reposition(this.snake.body);
    this.isGameOver = false;
  }

  update() {
    const removed = this.snake.move();
    const head = this.snake.getHead();

    // Wall collision
    if (
      head.x < 0 || head.y < 0 ||
      head.x >= this.tileCount || head.y >= this.tileCount
    ) {
      this.isGameOver = true;
    }

    // Self collision
    if (this.snake.hitsItself()) {
      this.isGameOver = true;
    }

    // Eat food
    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.grow();
      this.food.reposition(this.snake.body);
    }

    return !this.isGameOver;
  }

  draw() {
    const { ctx, gridSize } = this;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, gridSize * this.tileCount, gridSize * this.tileCount);

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(this.food.x * gridSize, this.food.y * gridSize, gridSize, gridSize);

    // Draw snake
    ctx.fillStyle = 'lime';
    this.snake.body.forEach(part => {
      ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });

    if (this.isGameOver) {
      ctx.fillStyle = 'white';
      ctx.font = '24px sans-serif';
      ctx.fillText('Game Over', 100, 200);
    }
  }
}

const SnakeModal = ({ onClose }) => {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.focus();

    document.body.style.overflow = 'hidden'; //Prevents Scrolling

    const game = new Game(ctx);
    gameRef.current = game;

    const keyHandler = (e) => {
      switch (e.key) {
        case 'ArrowUp': game.snake.setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': game.snake.setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': game.snake.setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': game.snake.setDirection({ x: 1, y: 0 }); break;
        default: break;
      }
    };

    const trapTab = (e) => { //Stops tab being able to exit the screen
      if (e.key === 'Tab') {
        e.preventDefault();
        canvas.focus();
      }
    };
    
    canvas.addEventListener('keydown', trapTab); //When keys are pressed, these get triggered
    canvas.addEventListener('keydown', keyHandler);

    intervalRef.current = setInterval(() => {
      const stillPlaying = game.update();
      game.draw();
      if (!stillPlaying) clearInterval(intervalRef.current);
    }, 100);

    return () => { //Returns all modifed controls back to normal
      canvas.removeEventListener('keydown', keyHandler);
      canvas.removeEventListener('keydown', trapTab);
      clearInterval(intervalRef.current);
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
      <div style={{ position: 'relative', backgroundColor: 'black', padding: 20 }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          tabIndex={0}
          style={{ display: 'block', outline: 'none' }}
        />
        <button
          onClick={onClose}
          className='close-button'>
          Close
        </button>
      </div>
    </div>
  );
};

export default SnakeModal;
