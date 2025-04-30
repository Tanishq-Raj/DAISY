import cv2
import time
import numpy as np

def check_camera():
    print("Checking camera access...")
    
    # Try multiple camera indices
    for camera_index in [0, 1, 2]:
        print(f"Trying camera index: {camera_index}")
        cap = cv2.VideoCapture(camera_index, cv2.CAP_DSHOW)  # Add cv2.CAP_DSHOW for Windows
        
        if not cap.isOpened():
            print(f"Could not open camera with index {camera_index}")
            continue
        
        # Try to read a frame
        ret, frame = cap.read()
        
        if not ret:
            print(f"Could not read from camera with index {camera_index}")
            cap.release()
            continue
        
        # Success!
        print(f"SUCCESS: Camera with index {camera_index} is working properly!")
        print(f"Camera resolution: {frame.shape[1]}x{frame.shape[0]}")
        
        # Try to display the frame
        try:
            # Display the frame
            print("Showing camera feed for 5 seconds...")
            window_name = "Camera Test"
            cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
            cv2.imshow(window_name, frame)
            
            # Keep capturing frames for 5 seconds
            start_time = time.time()
            while time.time() - start_time < 5:
                ret, frame = cap.read()
                if ret:
                    cv2.imshow(window_name, frame)
                
                # Break loop if 'q' key is pressed
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
            
            # Clean up
            cap.release()
            cv2.destroyAllWindows()
            
            print(f"Camera with index {camera_index} works fine! Use this index in the drowsiness detection script.")
            return True
        except Exception as e:
            print(f"Error displaying camera feed: {e}")
            # Continue checking other cameras
            cap.release()
            cv2.destroyAllWindows()
    
    # If no camera works, create a test image
    print("Could not find any working cameras. Creating a test frame...")
    test_frame = np.zeros((480, 640, 3), dtype=np.uint8)
    cv2.putText(test_frame, "No camera available", (150, 240), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    
    # Try to display the test frame
    try:
        window_name = "Camera Test - No Camera"
        cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
        cv2.imshow(window_name, test_frame)
        cv2.waitKey(3000)  # Wait for 3 seconds
        cv2.destroyAllWindows()
    except Exception as e:
        print(f"Error displaying test frame: {e}")
    
    print("ERROR: No working cameras found.")
    return False

if __name__ == "__main__":
    camera_working = check_camera()
    
    print("\nIf your camera is working but the drowsiness detection server still has issues:")
    print("1. Make sure no other application is using the camera (close Zoom, Teams, etc.)")
    print("2. Try restarting your computer")
    print("3. Check your browser's camera permissions")
    print("4. Make sure you've installed all required dependencies with 'pip install -r requirements.txt'")
    
    if not camera_working:
        print("\nTROUBLESHOOTING:")
        print("1. Check if your webcam is properly connected")
        print("2. Check Device Manager to verify webcam is recognized by Windows")
        print("3. Update your webcam drivers")
        print("4. Try using an external USB webcam if available") 