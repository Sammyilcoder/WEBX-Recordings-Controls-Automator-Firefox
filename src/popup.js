// Default settings
const DEFAULT_SETTINGS = {
    stepSeconds: 10,
    speedIncrement: 0.25
};

// DOM elements - will be set after DOM loads
let stepSecondsInput, speedIncrementInput, saveBtn, resetBtn, statusElem;

// Load settings on popup open
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements after DOM is loaded
    stepSecondsInput = document.getElementById('stepSeconds');
    speedIncrementInput = document.getElementById('speedIncrement');
    saveBtn = document.getElementById('saveBtn');
    resetBtn = document.getElementById('resetBtn');
    statusElem = document.getElementById('status');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveSettings();
        });
    } else {
        console.error('[WEBEX EXTENSION] Save button not found!');
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetSettings();
        });
    } else {
        console.error('[WEBEX EXTENSION] Reset button not found!');
    }
    
    loadSettings();
});

// Load settings from storage
function loadSettings() {
    // Use Firefox's browser.storage.local API
    browser.storage.local.get(DEFAULT_SETTINGS).then((result) => {
        console.log('[WEBEX EXTENSION] Settings loaded:', result);
        stepSecondsInput.value = result.stepSeconds;
        speedIncrementInput.value = result.speedIncrement;
    }).catch((error) => {
        console.error('[WEBEX EXTENSION] Error loading settings:', error);
        showStatus('Error loading settings', 'error');
    });
}

// Save settings to storage
function saveSettings() {
    const stepSeconds = parseInt(stepSecondsInput.value);
    const speedIncrement = parseFloat(speedIncrementInput.value);
    
    // Validate inputs
    if (isNaN(stepSeconds) || stepSeconds < 1 || stepSeconds > 300) {
        showStatus('Step seconds must be between 1 and 300', 'error');
        return;
    }
    
    if (isNaN(speedIncrement) || speedIncrement < 0.01 || speedIncrement > 2) {
        showStatus('Speed increment must be between 0.01 and 2', 'error');
        return;
    }
    
    const settings = {
        stepSeconds: stepSeconds,
        speedIncrement: speedIncrement
    };
    
    // Save to Firefox storage
    browser.storage.local.set(settings).then(() => {
        showStatus('Settings saved successfully!', 'success');
        
        // Notify content script about the settings change
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            if (tabs[0] && tabs[0].url.includes('.webex.com')) {
                browser.tabs.sendMessage(tabs[0].id, {
                    action: 'updateSettings',
                    settings: settings
                }).catch(() => {
                    // Content script might not be loaded yet, that's okay
                });
            }
        });
    }).catch((error) => {
        console.error('[WEBEX EXTENSION] Error saving settings:', error);
        showStatus('Error saving settings', 'error');
    });
}

// Reset settings to defaults
function resetSettings() {
    stepSecondsInput.value = DEFAULT_SETTINGS.stepSeconds;
    speedIncrementInput.value = DEFAULT_SETTINGS.speedIncrement;
    
    // Save the default settings
    browser.storage.local.set(DEFAULT_SETTINGS).then(() => {
        console.log('[WEBEX EXTENSION] Default settings saved to storage');
        showStatus('Settings reset to defaults', 'success');
        
        // Notify content script about the settings change
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            if (tabs[0] && tabs[0].url.includes('.webex.com')) {
                browser.tabs.sendMessage(tabs[0].id, {
                    action: 'updateSettings',
                    settings: DEFAULT_SETTINGS
                }).catch(() => {
                    // Content script might not be loaded yet, that's okay
                });
            }
        });
    }).catch((error) => {
        console.error('[WEBEX EXTENSION] Error resetting settings:', error);
        showStatus('Error resetting settings', 'error');
    });
}

// Show status message
function showStatus(message, type) {
    statusElem.textContent = message;
    statusElem.className = `status ${type}`;
    
    // Clear status after 3 seconds
    setTimeout(() => {
        statusElem.textContent = '';
        statusElem.className = 'status';
    }, 3000);
}
