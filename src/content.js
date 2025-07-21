/*

// Copyright: © 2020 Andrea Carpi (https://www.andreacarpi.it)
// Copyright: © 2025 Samuele De Ciechi
// Version: 3.0
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
	
*/
var debug = false;
if (window.location.href.includes(".webex.com")) {
	document.body.onkeydown = function(e) {
		if (e.code === "ArrowLeft") { 
			e.preventDefault();
			e.stopPropagation();
			try {updateSteps("SX"); } catch (e) {};
		}
		if (e.code === "ArrowRight") {
			e.preventDefault();
			e.stopPropagation();
			try {updateSteps("DX");} catch (e) {};
		}
		if (e.code === "ArrowUp") { 
			e.preventDefault();
			e.stopPropagation();
			try {updateSpeed("FASTER"); } catch (e) {};
		} 
		if (e.code === "ArrowDown") {
			e.preventDefault();
			e.stopPropagation();
			try {updateSpeed("SLOWER"); } catch (e) {};
		}
	}

	var step = 20; // seconds to skip forward/backward
	
	function updateSteps(desired = "DX") {
		try {
			// Target the specific VideoJS video element UPDATE HERE IF HTML CHANGES
			var video = document.querySelector('video.vjs-tech') || 
					   document.querySelector('video[id*="html5_api"]') ||
					   document.querySelector('video');
			
			if (video) {
				// Calculate new time position
				var currentTime = video.currentTime;
				var newTime;
				
				if (desired === "DX") {
					// Move forward
					newTime = Math.min(currentTime + step, video.duration);
				} else {
					// Move backward
					newTime = Math.max(currentTime - step, 0);
				}
				
				// Set the new time directly
				video.currentTime = newTime;
				
				// Show time notification to user
				var direction = desired === "DX" ? "forward" : "back";
				showTimeNotification(direction, step);
				
				console.log("Video time updated:", Math.floor(newTime) + "s / " + Math.floor(video.duration) + "s");
			} else {
				console.warn("Video element not found for time control");
			}
		} catch (e) { 
			console.warn("Time update error:", e); 
		}
	}

	var currentSpeed = 1.0; // Initialize speed to 1x
	
	// Show notification popup (generic function for both speed and time)
	function showNotification(message, type = 'speed') {
		// Remove existing notification if any
		var existingNotification = document.getElementById('webx-notification');
		if (existingNotification) {
			existingNotification.remove();
		}
		
		// Create notification element
		var notification = document.createElement('div');
		notification.id = 'webx-notification';
		notification.textContent = message;
		
		// Different colors for different notification types
		var backgroundColor = type === 'speed' ? 'rgba(0, 100, 200, 0.9)' : 'rgba(0, 150, 0, 0.9)';
		
		notification.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			background: ${backgroundColor};
			color: white;
			padding: 12px 18px;
			border-radius: 8px;
			font-family: Arial, sans-serif;
			font-size: 18px;
			font-weight: bold;
			z-index: 2147483647;
			transition: opacity 0.3s ease;
			pointer-events: none;
			border: 2px solid rgba(255, 255, 255, 0.3);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
		`;
		
		// Find the WebX video wrapper container UPDATE HERE IF HTML CHANGES
		var container = document.querySelector('.wxp-video-wrapper') || document.body;
		if (!container) {
			console.warn("WebX video wrapper container not found for notification");
			return;
		}
		container.appendChild(notification);
		
		// Auto-remove after 1.5 seconds
		setTimeout(function() {
			if (notification && notification.parentNode) {
				notification.style.opacity = '0';
				setTimeout(function() {
					if (notification && notification.parentNode) {
						notification.remove();
					}
				}, 300);
			}
		}, 1500);
	}
	
	// Show speed notification popup
	function showSpeedNotification(speed) {
		showNotification(speed + 'x', 'speed');
	}
	
	// Show time navigation notification
	function showTimeNotification(direction, seconds) {
		var message = direction === 'forward' ? `Forward ${seconds}s` : `Back ${seconds}s`;
		showNotification(message, 'time');
	}
	
	function updateSpeed(speed = "FASTER") {
		try {
			// Target the specific VideoJS video element UPDATE HERE IF HTML CHANGES
			var video = document.querySelector('video.vjs-tech') || 
					   document.querySelector('video[id*="html5_api"]') ||
					   document.querySelector('video');
			
			if (video) {
				// Adjust speed based on direction
				if (speed === "FASTER") {
					currentSpeed = Math.min(currentSpeed + 0.25, 5.0); // Max 5x speed
				} else if (speed === "SLOWER") {
					currentSpeed = Math.max(currentSpeed - 0.25, 0.25); // Min 0.25x speed
				}
				
				// Apply the new playback rate to the video
				video.playbackRate = currentSpeed;
				
				// Show speed notification to user
				showSpeedNotification(currentSpeed);
				
				console.log("Video speed set to:", currentSpeed + "x");
			} else {
				console.warn("Video element not found for speed control");
			}
		} catch (e) { 
			console.warn("Speed update error:", e); 
		}
	}
}



