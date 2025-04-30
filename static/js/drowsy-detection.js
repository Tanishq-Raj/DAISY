/**
 * Drowsiness Detection Module for Slow Roads
 * This module connects to the Python-based drowsiness detection server
 * and enables self-driving mode when drowsiness is detected.
 */

class DrowsinessDetector {
    constructor() {
        this.serverUrl = 'http://localhost:5000';
        this.isDrowsy = false;
        this.isSelfDriving = false;
        this.checkInterval = 1000; // Check every second (increased from 500ms)
        this.videoElement = null;
        this.gameControlsRef = null;
        this.connectionFailed = false;
        this.maxRetries = 5;
        this.currentRetries = 0;
        
        // Bind methods
        this.checkDrowsiness = this.checkDrowsiness.bind(this);
        this.toggleSelfDriving = this.toggleSelfDriving.bind(this);
        this.setupVideoFeed = this.setupVideoFeed.bind(this);
    }

    /**
     * Initialize the drowsiness detector
     * @param {Object} gameControls - Reference to the game's control system
     */
    init(gameControls) {
        console.log('Initializing Drowsiness Detection System');
        this.gameControlsRef = gameControls;
        
        // Create status display
        this.createStatusDisplay();
        
        // Setup video feed
        this.setupVideoFeed();
        
        // Start checking for drowsiness
        this.startDrowsinessDetection();
        
        // Find extra game control references for better integration
        this.findGameReferences();
        
        // Add window event listener for manual toggle (for testing)
        window.addEventListener('keydown', (e) => {
            if (e.key === 'd') {
                this.toggleSelfDriving(!this.isSelfDriving);
            }
        });
    }

    /**
     * Try to find game references for better integration
     */
    findGameReferences() {
        // Look for various game objects in the global scope
        setTimeout(() => {
            // Try to find more game objects for better integration
            if (window.game) {
                console.log('Found game object for better integration');
                this.gameRef = window.game;
            }
            
            // Look for additional input controls
            if (window.InputManager) {
                console.log('Found InputManager for better integration');
                this.inputManagerRef = window.InputManager;
            }
        }, 3000);
    }

    /**
     * Create status display elements
     */
    createStatusDisplay() {
        // Create container
        const container = document.createElement('div');
        container.id = 'drowsy-detection-status';
        container.style.position = 'absolute';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.padding = '10px';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        container.style.color = 'white';
        container.style.borderRadius = '5px';
        container.style.zIndex = '1000';
        
        // Create status text
        const statusText = document.createElement('div');
        statusText.id = 'drowsy-status';
        statusText.textContent = 'Drowsiness Detection: Connecting...';
        container.appendChild(statusText);
        
        // Create self-driving status
        const selfDrivingStatus = document.createElement('div');
        selfDrivingStatus.id = 'self-driving-status';
        selfDrivingStatus.textContent = 'Self-Driving: Off';
        container.appendChild(selfDrivingStatus);
        
        // Create connection status
        const connectionStatus = document.createElement('div');
        connectionStatus.id = 'connection-status';
        connectionStatus.textContent = 'Server Connection: Connecting...';
        container.appendChild(connectionStatus);
        
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Toggle Self-Driving';
        toggleButton.style.marginTop = '10px';
        toggleButton.style.padding = '5px';
        toggleButton.addEventListener('click', () => {
            this.toggleSelfDriving(!this.isSelfDriving);
        });
        container.appendChild(toggleButton);
        
        // Add to document
        document.body.appendChild(container);
    }

    /**
     * Update connection status display
     */
    updateConnectionStatus(isConnected, message = '') {
        const connectionElement = document.getElementById('connection-status');
        if (connectionElement) {
            if (isConnected) {
                connectionElement.textContent = 'Server Connection: Connected';
                connectionElement.style.color = 'green';
            } else {
                connectionElement.textContent = `Server Connection: Error${message ? ' - ' + message : ''}`;
                connectionElement.style.color = 'red';
            }
        }
    }

    /**
     * Setup video feed from the drowsiness detection server
     */
    setupVideoFeed() {
        // Create a small video element to display the webcam feed
        const videoContainer = document.createElement('div');
        videoContainer.style.position = 'absolute';
        videoContainer.style.bottom = '10px';
        videoContainer.style.right = '10px';
        videoContainer.style.width = '160px';
        videoContainer.style.height = '120px';
        videoContainer.style.zIndex = '1000';
        videoContainer.style.border = '2px solid white';
        
        this.videoElement = document.createElement('img');
        this.videoElement.src = `${this.serverUrl}/video_feed`;
        this.videoElement.style.width = '100%';
        this.videoElement.style.height = '100%';
        this.videoElement.onerror = () => {
            console.error('Failed to load video feed');
            this.videoElement.style.display = 'none';
            
            // Show error message in container
            const errorMsg = document.createElement('div');
            errorMsg.textContent = 'Camera feed unavailable';
            errorMsg.style.color = 'red';
            errorMsg.style.textAlign = 'center';
            errorMsg.style.marginTop = '50px';
            videoContainer.appendChild(errorMsg);
        };
        
        videoContainer.appendChild(this.videoElement);
        document.body.appendChild(videoContainer);
    }

    /**
     * Start the drowsiness detection loop
     */
    startDrowsinessDetection() {
        // Start interval to check drowsiness status
        this.detectionInterval = setInterval(this.checkDrowsiness, this.checkInterval);
    }

    /**
     * Check if the user is drowsy by querying the Python server
     */
    checkDrowsiness() {
        const connectionTimeout = setTimeout(() => {
            if (!this.connectionFailed) {
                this.connectionFailed = true;
                this.updateConnectionStatus(false, 'Connection timeout');
            }
        }, 2000);

        fetch(`${this.serverUrl}/drowsy_status`)
            .then(response => {
                clearTimeout(connectionTimeout);
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                // Reset retry counter on success
                this.currentRetries = 0;
                this.connectionFailed = false;
                this.updateConnectionStatus(true);
                return response.json();
            })
            .then(data => {
                const wasDriverDrowsy = this.isDrowsy;
                this.isDrowsy = data.is_drowsy;
                
                // Update status display
                const statusElement = document.getElementById('drowsy-status');
                if (statusElement) {
                    statusElement.textContent = `Drowsiness Detection: ${this.isDrowsy ? 'DROWSY DETECTED' : 'Alert'}`;
                    statusElement.style.color = this.isDrowsy ? 'red' : 'green';
                }
                
                // If drowsiness state changed from alert to drowsy, enable self-driving
                if (this.isDrowsy && !wasDriverDrowsy) {
                    console.log('Drowsiness detected! Enabling self-driving mode.');
                    this.toggleSelfDriving(true);
                }
            })
            .catch(error => {
                clearTimeout(connectionTimeout);
                console.error('Error checking drowsiness status:', error);
                this.currentRetries++;
                
                if (this.currentRetries >= this.maxRetries) {
                    // If we've tried too many times, stop trying and show error
                    if (!this.connectionFailed) {
                        this.connectionFailed = true;
                        this.updateConnectionStatus(false, error.message);
                    }
                }
            });
    }

    /**
     * Toggle self-driving mode
     * @param {boolean} enable - Whether to enable or disable self-driving
     */
    toggleSelfDriving(enable) {
        this.isSelfDriving = enable;
        
        // Update status display
        const selfDrivingElement = document.getElementById('self-driving-status');
        if (selfDrivingElement) {
            selfDrivingElement.textContent = `Self-Driving: ${this.isSelfDriving ? 'On' : 'Off'}`;
            selfDrivingElement.style.color = this.isSelfDriving ? 'orange' : 'white';
        }
        
        // Apply self-driving logic to the game controls
        this.applySelfDriving();
    }

    /**
     * Apply self-driving logic to the game controls
     * This simulates steady driving when self-driving is enabled
     */
    applySelfDriving() {
        if (!this.gameControlsRef) return;
        
        if (this.isSelfDriving) {
            // Self-driving logic: keep the car steady on the road
            
            // Multiple approaches to try to control the car in self-driving mode
            
            // 1. Direct key manipulation if game uses this.gameControlsRef.key
            if (this.gameControlsRef.key) {
                this.gameControlsRef.key.w = true;  // Forward motion
                this.gameControlsRef.key.a = false; // No left turn
                this.gameControlsRef.key.d = false; // No right turn
                this.gameControlsRef.key.s = false; // No braking
            }
            
            // 2. Disable user mouse control if game uses it
            if (this.gameControlsRef.mouseEnabled !== undefined) {
                this.savedMouseState = this.gameControlsRef.mouseEnabled;
                this.gameControlsRef.mouseEnabled = false;
            }
            
            // 3. Try to find auto-driving functions in the game
            try {
                // Look for auto-drive functions in the game objects
                if (window.AUTO_DRIVE) {
                    window.AUTO_DRIVE.enable();
                }
                
                // Check for autopilot in game object
                if (window.game && window.game.autopilot) {
                    window.game.autopilot.enable();
                }
                
                // Another approach - try to dispatch a key event
                const autopilotKeyEvent = new KeyboardEvent('keydown', { 
                    key: 'a',
                    code: 'KeyA',
                    keyCode: 65,
                    which: 65,
                    bubbles: true
                });
                document.dispatchEvent(autopilotKeyEvent);
            } catch (e) {
                console.log('Advanced auto-drive activation failed:', e);
            }
            
            console.log('Self-driving mode activated');
        } else {
            // Return control to the user
            if (this.gameControlsRef.mouseEnabled !== undefined && this.savedMouseState !== undefined) {
                this.gameControlsRef.mouseEnabled = this.savedMouseState;
            }
            
            // Try to disable auto-drive functions
            try {
                if (window.AUTO_DRIVE) {
                    window.AUTO_DRIVE.disable();
                }
                
                if (window.game && window.game.autopilot) {
                    window.game.autopilot.disable();
                }
            } catch (e) {
                console.log('Auto-drive deactivation failed:', e);
            }
            
            console.log('Self-driving mode deactivated');
        }
    }

    /**
     * Clean up resources when the detector is no longer needed
     */
    destroy() {
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
        }
        
        // Remove UI elements
        const statusElement = document.getElementById('drowsy-detection-status');
        if (statusElement) {
            document.body.removeChild(statusElement);
        }
        
        if (this.videoElement && this.videoElement.parentNode) {
            document.body.removeChild(this.videoElement.parentNode);
        }
    }
}

// Create global instance
window.drowsinessDetector = new DrowsinessDetector(); 