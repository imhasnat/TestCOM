// Save form data to localStorage
export const saveFormData = (key, data) => {
  try {
    // Retrieve existing data
    const existingData = getFormData(key) || [];

    // Check if the data object has an ID
    if (data.id) {
      // Check if data with this ID already exists
      const dataIndex = existingData.findIndex((item) => item.id === data.id);

      if (dataIndex !== -1) {
        // Update existing data
        existingData[dataIndex] = data;
      } else {
        // Add new data if ID does not exist
        existingData.push(data);
      }
    } else {
      // Add new data without ID
      existingData.push(data);
    }

    // Save updated data back to localStorage
    const jsonData = JSON.stringify(existingData);
    localStorage.setItem(key, jsonData);
  } catch (error) {
    console.error("Error saving form data to localStorage:", error);
  }
};
// Get form data from localStorage
export const getFormData = (key) => {
  try {
    const jsonData = localStorage.getItem(key);
    return jsonData ? JSON.parse(jsonData) : null;
  } catch (error) {
    console.error("Error getting form data from localStorage:", error);
    return null;
  }
};

// Get form data by ID from localStorage
export const getFormDataById = (key, id) => {
  try {
    // Retrieve all data for the given key
    const jsonData = localStorage.getItem(key);

    // Parse the data
    const dataArray = jsonData ? JSON.parse(jsonData) : [];

    // Find the item with the matching ID
    const item = dataArray.find((entry) => entry.id === id);

    return item || null;
  } catch (error) {
    console.error("Error getting form data from localStorage:", error);
    return null;
  }
};

// Remove form data from localStorage (optional utility function)
export const deleteFormData = (key, id) => {
  try {
    const existingData = getFormData(key);
    const updatedData = existingData.filter((item) => item.id !== id);
    if (localStorage.setItem(key, JSON.stringify(updatedData))) {
      return true;
    }
  } catch (error) {
    console.error("Error deleting form data from localStorage:", error);
  }
};
