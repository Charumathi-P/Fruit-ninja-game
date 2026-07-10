// ======================================
// Fruit Ninja Game
// Part 3.1
// ======================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// HUD
const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const highScoreText = document.getElementById("highScore");
const menu = document.getElementById("menu");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const pauseBtn = document.getElementById("pauseBtn");
// Sounds
const sliceSound = document.getElementById("sliceSound");
const bombSound = document.getElementById("bombSound");
const gameOverSound = document.getElementById("gameOverSound");
const bgMusic = document.getElementById("bgMusic");
// ---------------------------
// Variables
// ---------------------------
let fruits = [];
let particles = [];
let mouseTrail = [];
let score = 0;
let lives = 3;
let gameRunning = false;
let paused = false;
let spawnTimer = 0;
let combo = 0;
let highScore = localStorage.getItem("fruitHighScore") || 0;
highScoreText.textContent = highScore;
// ---------------------------
// Fruit Class
// ---------------------------
class Fruit {
    constructor() {
        this.radius = Math.random() * 20 + 30;
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.y = canvas.height + this.radius;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = -(Math.random() * 12 + 18);
        this.gravity = 0.35;
        this.sliced = false;
        const colors = [
            "#ff0000",
            "#00c853",
            "#ffd600",
            "#ff9800",
            "#ff4081",
            "#9c27b0"
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}
// ---------------------------
// Bomb Class
// ---------------------------
class Bomb {
    constructor() {
        this.radius = 30;
        this.x = Math.random() * (canvas.width - 60) + 30;
        this.y = canvas.height + 30;
        this.speedX = (Math.random() - 0.5) * 6;
        this.speedY = -(Math.random() * 10 + 16);
        this.gravity = 0.35;
        this.isBomb = true;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = "#111";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("💣", this.x - 12, this.y + 8);
    }
}
// ---------------------------
// Particle Class
// ---------------------------
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 6 + 2;
        this.speedX = (Math.random() - 0.5) * 10;
        this.speedY = (Math.random() - 0.5) * 10;
        this.life = 40;
        this.color = color;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
    }
    draw() {
        ctx.globalAlpha = this.life / 40;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}
// ---------------------------
// Mouse Trail
// ---------------------------
canvas.addEventListener("mousemove", function (e) {
    if (!gameRunning || paused) return;
    mouseTrail.push({
        x: e.clientX,
        y: e.clientY
    });
    if (mouseTrail.length > 15) {
        mouseTrail.shift();
    }
});
function drawTrail() {
    if (mouseTrail.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(mouseTrail[0].x, mouseTrail[0].y);
    for (let i = 1; i < mouseTrail.length; i++) {
        ctx.lineTo(mouseTrail[i].x, mouseTrail[i].y);
    }
    ctx.strokeStyle = "rgba(255,255,255,.7)";
    ctx.lineWidth = 5;
    ctx.stroke();
}
// ---------------------------
// Spawn Object
// ---------------------------
function spawnObject() {
    if (Math.random() < 0.15) {
        fruits.push(new Bomb());
    } else {
        fruits.push(new Fruit());
    }
}
