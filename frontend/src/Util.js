import axios from 'axios';
import { useState } from 'react';

export function getUserSavedRecipes(userId) {
  let userSavedRecipes = [{ userId: 1, recipeID: 1, savedAt: Date.now() }]; //api call to return user_saved_recipes objects with matching userID
  return userSavedRecipes;
}

export function getRecipe(recipeId) {
  let recipe = {
    recipeID: 1,
    name: 'Scrambled Eggs',
    instructions: 'Scramble, then egg.',
    cuisine: 'Global',
    dietaryRestrictions: 'eggs',
    createdBy: 1,
    createdAt: Date.now(),
  }; //api call to get recipe with matching userID
  return recipe;
}

export function getRecipeIngredients(recipeID) {
  let recipeIngredients = [
    { recipeID: 1, itemID: 1, quantity: 3, unit: 'item' },
    { recipeID: 1, itemID: 2, quantity: 1, unit: 'tablespoon' },
    { recipeID: 1, itemID: 3, quantity: 0.25, unit: 'cup' },
    { recipeID: 1, itemID: 4, quantity: 0.33, unit: 'cup' },
  ]; //api call to get recipe_ingredients with matching recipeID
  return recipeIngredients;
}

export function getFoodItem(itemID) {
  //will just be simple API call

  if (itemID == 1) {
    return {
      itemID: 1,
      name: 'Egg',
      category: 'poultry',
      defaultExpirationDays: 21,
    };
  } else if (itemID == 2) {
    return {
      itemID: 2,
      name: 'Salted Butter',
      category: 'dairy',
      defaultExpirationDays: 140,
    };
  } else if (itemID == 3) {
    return {
      itemID: 3,
      name: 'Shredded Cheese',
      category: 'dairy',
      defaultExpirationDays: 14,
    };
  } else if (itemID == 4) {
    return {
      itemID: 4,
      name: '1% Milk',
      category: 'dairy',
      defaultExpirationDays: 14,
    };
  } else {
    return {
      itemID: 0,
      name: '0',
      category: '0',
      defaultExpirationDays: 0,
    };
  }
}

export function getUserFridgeAccess(userID) {
  return [
    {
      userID: 1,
      fridgeID: 1,
      accessLevel: 'owner',
    },
  ]; //api call
}
export async function getFridgeContents(fridgeID) {
  try {
    const backendUrl = await getCachedBackendUrl();
    const response = await fetch(
      `${backendUrl}/get_fridge_contents?fridgeID=` + fridgeID,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data = await response.json();
    if (data.success) {
      return data.items;
    } else {
      console.error('Failed to fetch fridge contents');
      return [];
    }
  } catch (error) {
    console.error('Error fetching fridge contents:', error);
    return [];
  }
}
// export function getFridgeContents(fridgeID){
//     return [
//         {
//             "contentID" : 1,
//             "fridgeID" : 1,
//             "itemID" : 1,
//             "quantity" : 1,
//             "unit" : "item",
//             "expirationDate" : Date.now() + 1.814e+9,
//             "addedBy" : 1,
//             "addedAt" : Date.now()
//         },
//         {
//             "contentID" : 2,
//             "fridgeID" : 1,
//             "itemID" : 4,
//             "quantity" : 6,
//             "unit" : "cup",
//             "expirationDate" : Date.now() + 1.814e+9,
//             "addedBy" : 1,
//             "addedAt" : Date.now()
//         }
//     ] //api call
// }

export function getFridge(fridgeID) {
  return { fridgeID: 1, name: "John's Fridge", createdAt: Date.now() }; //api call
}

export async function addFridgeAccess(username, fridgeID, accessLevel) {
  try {
    const backendUrl = await getCachedBackendUrl();
    const response = await axios.post(`${backendUrl}/add_fridge_access`, {
      username: username,
      fridgeID: fridgeID,
      accessLevel: accessLevel,
    });
    return response.data;
  } catch (error) {
    console.error('There was an error adding a fridge access row\n' + error);
    throw error;
  }
}

// taken from
// https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
export default function useToken() {
  const timestamp = localStorage.getItem('timestamp');
  if (Date.now() - timestamp > 43200000) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  const getToken = () => {
    const username = localStorage.getItem('username');
    let token = localStorage.getItem('token');
    if (token == null || username == null) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      token = null;
    }
    return token;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (username, token) => {
    if (username == null) {
      localStorage.removeItem('username');
    } else {
      localStorage.setItem('username', username);
    }
    if (token == null) {
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token', token);
    }
    if (username != null && token != null) {
      localStorage.setItem('timestamp', Date.now());
    }
    setToken(token);
  };

  return {
    setToken: saveToken,
    token,
  };
}

/**
 * Dynamically discovers the backend API base URL by testing common ports
 * @returns {Promise<string>} The base URL of the running backend server
 */
export const getBackendBaseUrl = async () => {
  // 1) Respect explicit override when provided
  const explicit = process.env.REACT_APP_BACKEND_URL;
  if (explicit && explicit.trim().length > 0) {
    try {
      const res = await fetch(`${explicit}/GET_DATA`, { method: 'GET' });
      if (res.ok) {
        console.log(`Using explicit backend URL: ${explicit}`);
        return explicit;
      }
    } catch (e) {
      console.warn(
        `Explicit REACT_APP_BACKEND_URL unreachable: ${explicit}`,
        e,
      );
    }
  }

  // 2) Probe common ports on both localhost and 127.0.0.1
  const hosts = ['localhost', '127.0.0.1'];
  const ports = [5001, 5000];

  for (const host of hosts) {
    for (const port of ports) {
      const baseUrl = `http://${host}:${port}`;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const response = await fetch(`${baseUrl}/GET_DATA`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          console.log(`Backend detected at ${baseUrl}`);
          return baseUrl;
        }
      } catch (error) {
        // Try next combo
        console.log(
          `No response from ${baseUrl}:`,
          error?.message ?? 'unknown error',
        );
      }
    }
  }

  // 3) Fallback to 5001 first (project default), then 5000
  console.warn('No backend detected; falling back to http://localhost:5001');
  return 'http://localhost:5001';
};

/**
 * Makes an API call to the backend with automatic port discovery
 * @param {string} endpoint - The API endpoint (e.g., '/get_gemini_api_key')
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<Response>} The fetch response
 */
export const apiCall = async (endpoint, options = {}) => {
  const baseUrl = await getBackendBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
};

/**
 * Cached backend URL to avoid repeated discovery calls
 */
let cachedBackendUrl = null;

/**
 * Gets the backend URL with caching to improve performance
 * @returns {Promise<string>} The base URL of the running backend server
 */
export const getCachedBackendUrl = async () => {
  if (!cachedBackendUrl) {
    cachedBackendUrl = await getBackendBaseUrl();
  }
  return cachedBackendUrl;
};

/**
 * Clears the cached backend URL (useful for testing or if server restarts)
 */
export const clearBackendUrlCache = () => {
  cachedBackendUrl = null;
};
