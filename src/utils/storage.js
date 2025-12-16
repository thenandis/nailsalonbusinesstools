// Utility functions for local storage
export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

export const loadData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
};

export const deleteData = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error deleting data:', error);
    return false;
  }
};

export const getAllSavedSets = () => {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('nailsalon_')) {
      keys.push(key);
    }
  }
  return keys;
};