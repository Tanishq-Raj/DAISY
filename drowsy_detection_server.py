import cv2
import numpy as np
import math
import time
from flask import Flask, Response, jsonify
from flask_cors import CORS
import threading

app = Flask(__name__)
# Update CORS configuration to explicitly allow requests from localhost:8000
CORS(app, resources={r"/*": {"origins": ["http://localhost:8000", "http://127.0.0.1:8000"]}})

# Global variable to store drowsiness state
is_drowsy = False

class SleepDetection:
    def __init__(self):
        # Try multiple camera indices
        self.cap = None
        for camera_index in [0, 1, 2]:
            print(f"Trying camera index: {camera_index}")
            cap = cv2.VideoCapture(camera_index, cv2.CAP_DSHOW)  # Add cv2.CAP_DSHOW for Windows
            if cap.isOpened():
                ret, test_frame = cap.read()
                if ret:
                    print(f"Successfully connected to camera index {camera_index}")
                    self.cap = cap
                    self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                    self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                    break
                else:
                    print(f"Camera index {camera_index} opened but couldn't read frame")
                    cap.release()
            else:
                print(f"Failed to open camera index {camera_index}")
        
        if self.cap is None:
            print("ERROR: Could not find a working camera. Please check your camera connection.")
        
        # Initialize face and eye detectors
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        
        # Constants
        self.EYE_CLOSED_THRESHOLD = 10  # Frames to trigger drowsiness alert
        
        # State variables
        self.closed_eyes_counter = 0
        
    def detect_eyes(self, frame):
        global is_drowsy
        
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.1, 5)
        
        if len(faces) == 0:
            return "no_face", frame
        
        x, y, w, h = faces[0]
        face_roi = gray[y:y+h, x:x+w]
        eyes = self.eye_cascade.detectMultiScale(face_roi, 1.1, 3)
        
        # Draw face rectangle
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        
        if len(eyes) < 2:
            return "eyes_closed", frame
        else:
            return "eyes_open", frame
    
    def run(self):
        global is_drowsy
        print("Starting Sleep Detection System...")
        
        # Check if camera is available
        if self.cap is None:
            # Generate a frame with an error message
            frame = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(frame, "Camera unavailable", (150, 240), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            # Convert frame to JPEG for streaming
            _, jpeg = cv2.imencode('.jpg', frame)
            frame_bytes = jpeg.tobytes()
            
            # Yield the error frame indefinitely
            while True:
                yield (b'--frame\r\n'
                      b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                time.sleep(1)
        
        while True:
            try:
                ret, frame = self.cap.read()
                if not ret:
                    print("Failed to grab frame")
                    # If frame grab fails, create an error frame
                    frame = np.zeros((480, 640, 3), dtype=np.uint8)
                    cv2.putText(frame, "Camera feed lost", (150, 240), 
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                else:
                    # Detect eyes
                    status, frame = self.detect_eyes(frame)
                    
                    # Update drowsiness state
                    if status == "eyes_closed":
                        self.closed_eyes_counter += 1
                        if self.closed_eyes_counter >= self.EYE_CLOSED_THRESHOLD:
                            is_drowsy = True
                    else:
                        self.closed_eyes_counter = 0
                        is_drowsy = False
                    
                    # Display status on main frame
                    status_text = "DROWSY DETECTED" if is_drowsy else "ALERT"
                    text_color = (0, 0, 255) if is_drowsy else (0, 255, 0)
                    cv2.putText(frame, status_text, (10, 30), 
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, text_color, 2)
                
                # Convert frame to JPEG for streaming
                _, jpeg = cv2.imencode('.jpg', frame)
                frame_bytes = jpeg.tobytes()
                
                # Yield the frame as part of a multipart response
                yield (b'--frame\r\n'
                      b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                
                # Small delay to reduce CPU usage
                time.sleep(0.03)
            except Exception as e:
                print(f"Error in processing: {e}")
                # Create an error frame
                frame = np.zeros((480, 640, 3), dtype=np.uint8)
                cv2.putText(frame, f"Error: {str(e)[:30]}", (50, 240), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                
                # Convert frame to JPEG for streaming
                _, jpeg = cv2.imencode('.jpg', frame)
                frame_bytes = jpeg.tobytes()
                
                # Yield the error frame
                yield (b'--frame\r\n'
                      b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                
                time.sleep(0.5)

# Initialize the sleep detection
detector = SleepDetection()

@app.route('/video_feed')
def video_feed():
    """Video streaming route."""
    # Add CORS headers specifically for this endpoint
    response = Response(
        detector.run(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/drowsy_status')
def drowsy_status():
    """Return current drowsiness status as JSON."""
    global is_drowsy
    response = jsonify({"is_drowsy": is_drowsy})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

def run_flask():
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)

if __name__ == "__main__":
    # Start the Flask app
    run_flask() 