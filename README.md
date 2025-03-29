# AI Robot Maze Simulation

This project simulates a human-shaped (represented as a simple circle) AI robot navigating a 2D maze environment. The robot utilizes a simplified form of reinforcement learning concepts, driven by predefined weights, to make navigation decisions based on simulated depth and lidar sensor data.

This repository contains the HTML, CSS, and JavaScript code for three different "models" of the robot, each with a distinct set of navigation weights. This allows for a basic comparison of how different weight configurations can affect the robot's behavior within the maze.

**Note:** This is a simplified 2D simulation intended for demonstration purposes. It does not implement true 3D rendering or a full reinforcement learning training process.

## Key Features

* **2D Maze Environment:** A randomly generated 2D maze for the robot to navigate.
* **Simulated Robot:** A circular representation of a robot with a visual indicator of its facing direction.
* **Simplified Depth Sensing:** The robot can sense if there is a wall directly in front of it.
* **Simplified Lidar:** The robot simulates multiple lidar beams to detect obstacles at various angles.
* **Predefined Model Weights:** Three distinct sets of weights are defined, influencing the robot's decision-making process (forward movement, turning left, turning right).
* **Model Selection:** A dropdown allows you to choose which of the three models to run in the simulation.
* **Start/Stop Control:** Buttons to start and stop the simulation.
* **Training Data Export:** Functionality to export the recorded simulation data (state, action, reward) as a JSON file for each model.

## Getting Started

1.  **Clone the Repository (if applicable):** If you have this code in a Git repository, clone it to your local machine.
2.  **Open in VS Code:** Open the root folder (`ai_robot_maze`) in Visual Studio Code. You should see the following folder structure:

    ```
    ai_robot_maze/
    ├── model1/
    │   ├── index.html
    │   ├── script.js
    │   └── style.css
    ├── model2/
    │   ├── index.html
    │   ├── script.js
    │   └── style.css
    ├── model3/
    │   ├── index.html
    │   ├── script.js
    │   └── style.css
    └── script.js         <-- Shared script file
    ```

    **Note:** The `script.js` file in the root directory contains the main simulation logic and is shared by all three HTML files for simplicity.

3.  **Open an HTML File:** To run a specific model, open the `index.html` file located within its respective folder (e.g., `model1/index.html`) in your web browser.

## Usage

1.  **Select a Model:** Once the page loads, use the "Select Model" dropdown to choose which of the three robot models you want to simulate.
2.  **Start Simulation:** Click the "Start Simulation" button to begin the robot's navigation in the randomly generated maze.
3.  **Observe the Robot:** Watch how the robot moves and reacts to the maze walls based on its predefined weights. Different models should exhibit different behaviors.
4.  **Export Training Data:** After the simulation runs (or at any point), you can click the "Export Training Data" button. This will download a JSON file containing the sequence of the robot's states (sensor readings), actions taken, and the rewards received during the simulation for the selected model. The filename will indicate which model's data is being exported (e.g., `training_data_model1.json`).

## Simplified Reinforcement Learning

The reinforcement learning aspect of this simulation is highly simplified. Instead of the robot learning through interaction, each model has a predefined set of weights that dictate its probability of choosing an action (move forward, turn left, turn right) based on the input from its simulated sensors (depth and lidar).

The `getAction()` function in the `script.js` file demonstrates this basic policy. The "training data" generated is a record of the robot's interactions with the environment based on these fixed weights. In a real-world reinforcement learning scenario, these weights would be adjusted over time through an algorithm like Q-learning or policy gradients.

## Limitations

* **2D Simulation:** This is a 2D representation of the environment and the robot. True 3D depth sensing and lidar are not implemented.
* **Simplified Robot Representation:** The robot is represented as a simple circle. A more complex stick figure model would require additional drawing logic.
* **Basic Maze Generation:** The maze generation algorithm is simple and may not always produce very complex mazes.
* **No True Reinforcement Learning Training:** The robot does not learn in this simulation. The weights are predefined.
* **Simplified Sensors:** The depth and lidar sensing are basic simulations.
* **Goal Condition:** The goal is defined as reaching a specific cell in the maze.

## Future Enhancements (Optional)

* Implement a 3D rendering engine (e.g., using Three.js) to create a more realistic 3D environment.
* Develop a more sophisticated robot model, potentially resembling a stick figure.
* Integrate a proper reinforcement learning algorithm (like Q-learning) to allow the robot to learn to navigate the maze over time.
* Improve the complexity and variability of the maze generation.
* Enhance the sensor simulations to more accurately reflect real-world depth and lidar data.
* Add visualization of the robot's sensor data.

## Contributing (Optional)

If you are interested in contributing to this project, feel free to fork the repository and submit pull requests with improvements or bug fixes.

## License (Optional)

[Specify your license here, e.g., MIT License]

## Author

[Your Name/GitHub Username]