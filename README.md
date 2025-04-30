# DAISY – Driving AI Safety System

Your friendly AI companion that keeps you alert and safe on the road! 🚗✨

DAISY is your personal driving safety assistant that uses advanced AI to monitor your alertness and help prevent drowsy driving. Think of her as your co-pilot who always has your back! 🛡️

With DAISY, you get:
- **Smart Steering Control**: AI-powered wheel simulation that demonstrates how the car would respond to different driving conditions
- **Automated Braking System**: AI detects potential hazards and can trigger emergency braking when needed
- **Lane Keeping Assistance**: AI maintains the vehicle in its lane by monitoring road markings and surrounding vehicles
- **Speed Regulation**: AI adjusts the vehicle's speed based on traffic conditions and road signs

DAISY's AI system continuously learns and adapts to different driving scenarios, making your journey safer and more comfortable.

## Project Overview

DAISY is an intelligent system designed to enhance road safety by detecting and preventing drowsy driving. The system uses computer vision and AI to continuously monitor the driver's alertness and provide real-time feedback.

### Key Components

1. **Real-time Face and Eye Detection**
   - Uses OpenCV's Haar cascades for accurate face and eye detection
   - Monitors eye closure patterns to detect drowsiness

2. **Web-based Monitoring Interface**
   - Real-time video feed of the driver
   - Visual alerts for drowsiness detection
   - Wheel simulation to demonstrate vehicle control

3. **Smart Alert System**
   - Multiple threshold levels for drowsiness detection
   - Progressive alert system based on severity
   - Immediate response to critical situations

<<<<<<< HEAD
## Features

- Real-time drowsiness detection using your webcam
- Automatic switching to self-driving mode when drowsiness is detected
- Visual feedback showing your webcam feed and drowsiness status
- Manual toggle for self-driving mode (press 'D' key or use the button)

## Setup and Installation

### Prerequisites

- Python 3.6 or higher
- Web browser with webcam access
- The required Python packages (install using `pip install -r requirements.txt`):
  - OpenCV
  - NumPy
  - Flask
  - Flask-CORS

### Getting Started

1. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

2. Start the drowsiness detection server:
   ```
   python drowsy_detection_server.py
   ```

3. Start the web server to run DAISY:
   ```
   python -m http.server 8000
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

5. Allow webcam access when prompted by your browser

## How It Works

1. The drowsiness detection server uses OpenCV and Haar cascades to detect faces and eyes in the webcam feed
2. When the system detects closed eyes for a certain number of consecutive frames, it triggers drowsiness detection
3. When drowsiness is detected, the JavaScript client automatically switches the game to self-driving mode
4. The self-driving mode keeps the car moving forward at a steady pace
5. When the driver is alert again (eyes open), they can manually take control by clicking the toggle button

## Troubleshooting

- If the webcam feed doesn't appear, make sure you've allowed camera access in your browser
- If the detection server doesn't start, check that you have all the required Python packages installed
- If self-driving doesn't activate, check the browser console for any error messages

## Privacy Note

The webcam feed is processed locally on your machine and is not sent to any external servers.

## Credits

- Original DAISY game by Tanishq Raj
- Drowsiness detection system implemented using OpenCV and Python 
=======
### How It Works

1. **Initialization**
   - The system starts by initializing the camera and setting up the detection parameters
   - Creates a real-time video feed window for monitoring

2. **Face and Eye Detection**
   - Uses OpenCV's Haar cascades to detect faces in real-time
   - Once a face is detected, it focuses on eye regions
   - Continuously tracks eye movements and closure patterns

3. **Drowsiness Detection**
   - Monitors eye closure duration and frequency
   - Uses a threshold system to determine drowsiness levels
   - Triggers alerts based on the severity of drowsiness

4. **Alert System**
   - Visual alerts in the monitoring interface
   - Audio alerts (can be configured)
   - Wheel simulation to demonstrate potential vehicle control issues
>>>>>>> ff824be (Code update)

### Technical Implementation

The system is built using:
- Python with OpenCV for computer vision
- Flask for the web server
- HTML/CSS/JavaScript for the web interface
- Real-time video streaming using Flask's streaming capabilities

The core detection logic is implemented in two main components:

1. **Sleep Detection Module** (`sleep.py`)
   - Handles real-time face and eye detection
   - Implements the drowsiness detection algorithm
   - Manages the wheel simulation for demonstration

2. **Web Server Module** (`drowsy_detection_server.py`)
   - Provides the web interface for monitoring
   - Handles real-time video streaming
   - Manages client-server communication

### Safety Features

- Real-time monitoring of driver alertness
- Immediate detection of drowsiness
- Visual and audio alerts
- Wheel simulation to demonstrate potential risks
- Progressive alert system based on severity

### Usage Scenarios

1. **Personal Use**
   - Monitor your own alertness during long drives
   - Get immediate feedback about your driving state
   - Practice safe driving habits

2. **Fleet Management**
   - Monitor driver alertness in commercial vehicles
   - Implement safety protocols
   - Track driver performance

3. **Driver Training**
   - Demonstrate the risks of drowsy driving
   - Train drivers to recognize early signs of fatigue
<<<<<<< HEAD
   - Implement safety procedures
=======
   - Implement safety procedures
>>>>>>> ff824be (Code update)
