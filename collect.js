javascript
// This file handles the data collection and storage
// It's designed to be included in the collect.html file

// Collector object for handling data
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

    // Clear all collected data
    clearData: function() {
        localStorage.removeItem('victimData');
        console.log('All data cleared');
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = collector;
}
