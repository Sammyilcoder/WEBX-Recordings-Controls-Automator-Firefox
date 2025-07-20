/*

// Copyright: © 2020 Andrea Carpi (https://www.andreacarpi.it)
// Version: 2.0
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
	
*/
var debug = false;
if (window.location.href.includes(".webex.com")) {
	var basebar = false;
	var sliderBTNw = false;
	document.body.onkeydown = function(e) {
		if (e.code === "ArrowLeft") { 
			e.preventDefault();
			e.stopPropagation();
			try { 
				let rewindButton = document.querySelector('wxp-rewind-control button') ||
							   document.querySelector('.wxp-rewind-control button') ||
							   document.querySelector('button[title*="Rewind"]');
				if (rewindButton) {
					rewindButton.click();
				} else {
					updateSteps("SX");
				}
			} catch (e) {};
		}
		if (e.code === "ArrowRight") {
			e.preventDefault();
			e.stopPropagation();
			try { 
				let forwardBtn = document.querySelector('wxp-forward-control button') ||
								document.querySelector('.wxp-forward-control button') ||
								document.querySelector('button[title*="Fast forward"]');
				if (forwardBtn) {
					forwardBtn.click();
				} else {
					updateSteps("DX");
				}
			} catch (e) {};
		}
		if (e.code === "ArrowUp") { 
			e.preventDefault();
			e.stopPropagation();
			try { updateSpeed("FASTER"); } catch (e) {};
		} 
		if (e.code === "ArrowDown") {
			e.preventDefault();
			e.stopPropagation();
			try { updateSpeed("SLOWER"); } catch (e) {};
		}
	}

	var step = 10;
	function updateSteps(desired = "DX") {
		if (!basebar) {
			try {
				basebar = document.querySelector('.wxp-progress-bar-wrapper') ||
						 document.querySelector('wxp-progress-bar');
				
				sliderBTNw = document.querySelector('.wxp-progress-point') ||
							document.querySelector('.wxp-progress-bar .wxp-progress-point');
			} catch (e) { console.warn("0", e);}
		}
		try {
			setTimeout(function () {
				var timePieces;
				var timeElement = document.querySelector('.wxp-time-display div:last-child') ||
								 document.querySelector('wxp-time-display div:last-child');
				
				if (timeElement) {
					var timeText = timeElement.textContent || timeElement.innerHTML;
					var totalTime = timeText.includes("/") ? 
						timeText.split("/")[1].trim() : timeText.trim();
					timePieces = totalTime.split(":");
				} else {
					console.warn("Time element not found");
					return;
				}
				
				let [hh, mm, ss] = [0, 0, 0];
				if (timePieces.length == 1) {
					ss = timePieces[0];
				} else if (timePieces.length == 2) {
					mm = timePieces[0];
					ss = timePieces[1];
				} else if (timePieces.length == 3) {
					hh = timePieces[0];
					mm = timePieces[1];
					ss = timePieces[2];
				}
				var max = parseInt(hh)*60*60 + parseInt(mm)*60 + parseInt(ss);
				
				if (basebar && basebar.getBoundingClientRect) {
					var dx = basebar.getBoundingClientRect().width* (step/max);
					setTimeout(function () {
						if (sliderBTNw && $(sliderBTNw).simulate) {
							$(sliderBTNw).simulate("drag-n-drop", {dx: (desired == "DX")?dx:-dx});
						} else {
							console.warn("Cannot simulate drag - element or jQuery simulate not available");
						}
					} , 20);
				}
			}, 20)
		} catch (e) { console.warn("1", e); }
	}
	var currentSpeed = 1.0; // Initialize speed to 1x
	
	// Show speed notification popup
	function showSpeedNotification(speed) {
		// Remove existing notification if any
		var existingNotification = document.getElementById('webx-speed-notification');
		if (existingNotification) {
			existingNotification.remove();
		}
		
		// Create notification element
		var notification = document.createElement('div');
		notification.id = 'webx-speed-notification';
		notification.textContent = speed + 'x';
		notification.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			background: rgba(0, 0, 0, 0.9);
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
		
		// Find the WebX video wrapper container
		var container = document.querySelector('.wxp-video-wrapper') || document.body;
		
		// Add to the appropriate container
		container.appendChild(notification);
		
		// Auto-remove after 1 second
		setTimeout(function() {
			if (notification && notification.parentNode) {
				notification.style.opacity = '0';
				setTimeout(function() {
					if (notification && notification.parentNode) {
						notification.remove();
					}
				}, 300);
			}
		}, 1000);
	}
	
	function updateSpeed(speed = "FASTER") {
		try {
			// Find the video element
			var video = document.querySelector('video') || 
					   document.querySelector('wxp-video video') ||
					   document.querySelector('.wxp-video video');
			
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



