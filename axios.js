import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false
});

export const getFridges = async (username) => {
    try {
        const response = await api.get('/get_fridges', { params: { username } });
        return response.data;
    } catch (error) {
        console.error('Error fetching fridges:', error);
        return { success: false, fridgeIDs: [] };
    }
};

export const getFridgeContents = async (fridgeId) => {
    try {
        const response = await api.get('/get_fridge_contents', {
            params: { fridgeID: fridgeId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching fridge contents:', error);
        return { success: false, items: [] };
    }
};

export const addFridgeContent = async (data) => {
    try {
        const response = await api.post('/add_fridge_content', data);
        return response.data;
    } catch (error) {
        console.error('Error adding fridge content:', error);
        return { success: false, item: {} };
    }
};

export const updateFridgeContent = async (data) => {
    try {
        const response = await api.patch('/update_fridge_content', data);
        return response.data;
    } catch (error) {
        console.error('Error updating fridge content:', error);
        return { success: false, item: {} };
    }
};

export const deleteFridgeContent = async (itemID, fridgeID) => {
    try {
        const response = await api.delete('/delete_fridge_content', {
            data: { itemID, fridgeID }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting fridge content:', error);
        return { success: false };
    }
};