const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }
  return response.json();
};

const api = {
  get: async (path) => {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${path}`, { headers });
    return handleResponse(response);
  },

  post: async (path, body) => {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (path, body) => {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (path) => {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${path}`, {
      method: "DELETE",
      headers,
    });
    return handleResponse(response);
  },
};

export default api;

