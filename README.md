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
   - Implement safety procedures
