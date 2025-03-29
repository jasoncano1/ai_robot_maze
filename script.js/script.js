// --- Initialization ---
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const exportButton = document.getElementById('exportButton');
const modelSelect = document.getElementById('modelSelect');

let maze;
let robot;
let trainingData = [];
let currentModelWeights;

// --- Maze Parameters ---
const cellSize = 20;
const mazeWidth = 30;
const mazeHeight = 20;

// --- Robot Parameters ---
const robotRadius = 8;
const robotSpeed = 2;
const sensorRange = 50;
const lidarPoints = 8; // Number of lidar beams

// --- Model Weights (Placeholders) ---
const modelWeights = {
    model1: {
        // Example weights - these would be learned in a real scenario
        forward: 0.5,
        turnLeft: 0.2,
        turnRight: 0.3
    },
    model2: {
        forward: 0.7,
        turnLeft: 0.15,
        turnRight: 0.15
    },
    model3: {
        forward: 0.4,
        turnLeft: 0.4,
        turnRight: 0.2
    }
};

// --- Maze Generation (Simple Random Maze) ---
function generateMaze(width, height) {
    const cells = [];
    for (let y = 0; y < height; y++) {
        cells[y] = [];
        for (let x = 0; x < width; x++) {
            cells[y][x] = 1; // 1 represents a wall
        }
    }

    function carvePath(x, y) {
        cells[y][x] = 0; // 0 represents an open path
        const directions = [{dx: 0, dy: -2}, {dx: 0, dy: 2}, {dx: -2, dy: 0}, {dx: 2, dy: 0}];
        shuffleArray(directions);

        for (const dir of directions) {
            const newX = x + dir.dx;
            const newY = y + dir.dy;
            if (newX > 0 && newX < width - 1 && newY > 0 && newY < height - 1 && cells[newY][newX] === 1) {
                cells[y + dir.dy / 2][x + dir.dx / 2] = 0;
                carvePath(newX, newY);
            }
        }
    }

    carvePath(1, 1); // Start carving from a near-corner

    // Ensure an exit (for simplicity, at the opposite corner)
    cells[height - 2][width - 2] = 0;

    return cells;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- Robot Class ---
class Robot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = 0; // Facing right initially
    }

    senseDepth() {
        // Simplified depth sensing: check the cell directly in front
        const forwardX = Math.round(this.x + Math.cos(this.angle));
        const forwardY = Math.round(this.y + Math.sin(this.angle));
        if (maze && maze[forwardY] && maze[forwardY][forwardX] !== undefined) {
            return maze[forwardY][forwardX]; // 0 for open, 1 for wall
        }
        return 1; // Assume a wall if out of bounds
    }

    senseLidar() {
        const lidarReadings = [];
        for (let i = 0; i < lidarPoints; i++) {
            const angle = this.angle + (i / lidarPoints) * 2 * Math.PI;
            let distance = 0;
            let hitWall = false;
            while (distance < sensorRange && !hitWall) {
                distance++;
                const checkX = Math.round(this.x + distance * Math.cos(angle));
                const checkY = Math.round(this.y + distance * Math.sin(angle));
                if (maze && maze[checkY] && maze[checkY][checkX] === 1) {
                    hitWall = true;
                }
            }
            lidarReadings.push(hitWall ? distance : sensorRange);
        }
        return lidarReadings;
    }

    moveForward() {
        const newX = this.x + robotSpeed * Math.cos(this.angle);
        const newY = this.y + robotSpeed * Math.sin(this.angle);
        const gridX = Math.round(newX / cellSize);
        const gridY = Math.round(newY / cellSize);

        if (maze && maze[gridY] && maze[gridY][gridX] === 0) {
            this.x = newX;
            this.y = newY;
            return 1; // Reward for moving
        }
        return -1; // Penalty for hitting a wall
    }

    turnLeft() {
        this.angle -= Math.PI / 8;
        return 0;
    }

    turnRight() {
        this.angle += Math.PI / 8;
        return 0;
    }
}

// --- Drawing Functions ---
function drawMaze() {
    ctx.fillStyle = 'black';
    for (let y = 0; y < mazeHeight; y++) {
        for (let x = 0; x < mazeWidth; x++) {
            if (maze[y][x] === 1) {
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

function drawRobot() {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(robot.x, robot.y, robotRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    // Draw a line indicating the robot's direction
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(robot.x, robot.y);
    ctx.lineTo(robot.x + robotRadius * 2 * Math.cos(robot.angle), robot.y + robotRadius * 2 * Math.sin(robot.angle));
    ctx.stroke();
}

function drawLidar() {
    const lidarReadings = robot.senseLidar();
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i < lidarPoints; i++) {
        const angle = robot.angle + (i / lidarPoints) * 2 * Math.PI;
        const distance = lidarReadings[i];
        ctx.beginPath();
        ctx.moveTo(robot.x, robot.y);
        ctx.lineTo(robot.x + distance * Math.cos(angle), robot.y + distance * Math.sin(angle));
        ctx.stroke();
    }
}

// --- Reinforcement Learning Logic (Simplified with Predefined Weights) ---
function getAction(depth, lidarReadings, weights) {
    // This is a very basic policy based on the weights
    if (depth === 0) { // No wall in front
        if (Math.random() < weights.forward) {
            return 'forward';
        } else if (Math.random() < weights.forward + weights.turnLeft) {
            return 'turnLeft';
        } else {
            return 'turnRight';
        }
    } else { // Wall in front
        if (Math.random() < weights.turnLeft) {
            return 'turnLeft';
        } else {
            return 'turnRight';
        }
    }
}

function simulateStep() {
    const depth = robot.senseDepth();
    const lidarReadings = robot.senseLidar();
    const action = getAction(depth, lidarReadings, currentModelWeights);
    let reward = 0;

    switch (action) {
        case 'forward':
            reward = robot.moveForward();
            break;
        case 'turnLeft':
            reward = robot.turnLeft();
            break;
        case 'turnRight':
            reward = robot.turnRight();
            break;
    }

    trainingData.push({
        state: { depth: depth, lidar: lidarReadings },
        action: action,
        reward: reward
    });

    // Check if the robot reached the goal (very basic check)
    const gridX = Math.round(robot.x / cellSize);
    const gridY = Math.round(robot.y / cellSize);
    if (gridX === mazeWidth - 2 && gridY === mazeHeight - 2) {
        console.log('Goal Reached!');
        clearInterval(simulationInterval);
    }

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawRobot();
    drawLidar();
}

let simulationInterval;

function startSimulation() {
    clearInterval(simulationInterval);
    maze = generateMaze(mazeWidth, mazeHeight);
    robot = new Robot(cellSize / 2, cellSize / 2); // Start at the top-left
    trainingData = [];
    currentModelWeights = modelWeights[modelSelect.value];
    simulationInterval = setInterval(simulateStep, 100); // Adjust speed as needed
}

function exportData() {
    const dataStr = JSON.stringify(trainingData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const filename = 'training_data_' + modelSelect.value + '.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
}

// --- Event Listeners ---
startButton.addEventListener('click', startSimulation);
exportButton.addEventListener('click', exportData);