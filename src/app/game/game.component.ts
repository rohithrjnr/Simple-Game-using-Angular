import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  score = 0;
  strikeRate = 0;
  gameOver = false;
  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private ballX = 100;
  private ballY = 200;
  private ballSpeedX = 3;
  private ballSpeedY = 3;
  private batX = 300;
  private batWidth = 100;
  private batHeight = 10;

  ngOnInit() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.gameLoop();
  }

  gameLoop() {
    if (!this.gameOver) {
      this.update();
      this.draw();
      requestAnimationFrame(() => this.gameLoop());
    }
  }

  update() {
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;

    // Check for collision with the bat
    if (this.ballY + 10 >= this.canvas.height - this.batHeight &&
        this.ballX >= this.batX && this.ballX <= this.batX + this.batWidth) {
      this.ballSpeedY = -this.ballSpeedY;
      this.score += 1;
      this.strikeRate = (this.score / (this.score + 1)) * 100; 
    }

    // Check for boundaries
    if (this.ballX + 10 > this.canvas.width || this.ballX - 10 < 0) {
      this.ballSpeedX = -this.ballSpeedX;
    }
    if (this.ballY - 10 < 0) {
      this.ballSpeedY = -this.ballSpeedY;
    }

    // Game over condition
    if (this.ballY + 10 > this.canvas.height) {
      this.gameOver = true;
    }
  }

  draw() {
    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw bat
    this.context.fillStyle = 'black';
    this.context.fillRect(this.batX, this.canvas.height - this.batHeight, this.batWidth, this.batHeight);

    // Draw ball
    this.context.fillStyle = 'red';
    this.context.beginPath();
    this.context.arc(this.ballX, this.ballY, 10, 0, Math.PI * 2, true);
    this.context.fill();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.batX = event.clientX - rect.left - this.batWidth / 2;
  }

  restartGame() {
    this.gameOver = false;
    this.score = 0;
    this.strikeRate = 0;
    this.ballX = 100;
    this.ballY = 200;
    this.ballSpeedX = 3;
    this.ballSpeedY = 3;
    this.gameLoop();
  }
}
