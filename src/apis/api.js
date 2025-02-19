import axios from "axios";

const API_URL = "https://the-alter-office.onrender.com/api/auth";
const URL = "https://the-alter-office.onrender.com/api";

export const loginWithGoogle = () => {
    window.location.href = `${API_URL}/google`;
};

export const getUserProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
        const response = await axios.get(`${API_URL}/getUser`, {
            headers: { Authorization: token },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);

        if (error.response?.status === 401) {
            localStorage.removeItem("token");
        }

        return null;
    }
};


export const createUrl = async (data) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    try {
        const response = await axios.post(`${URL}/shorten`, data, {
            headers: { Authorization: token },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating URL:", error);
        return null;
    }
};

export const overAllDashData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }
    try {
        const response = await axios.get(`${URL}/getUrls`, {
            headers: { Authorization: token },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteUrlData = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found");
        return null;
    }

    try {
        const response = await axios.delete(`${URL}/url/${id}`, {
            headers: {
                Authorization: token,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error deleting URL:", error);
        return null;
    }
};

export const redirectOriginalUrl = async (alias) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found");
        return null;
    }

    try {
        const response = await axios.get(`${URL}/shorten/${alias}`, {
            headers: {
                Authorization: token,
            },
        });
        if (response && response.data && response.data.longUrl) {
            return response.data.longUrl;
        } else {
            console.error("Invalid response format", response);
            return null;
        }
    } catch (error) {
        console.error("Error fetching original URL:", error);
        return null;
    }
};

export const getUserAnalyticsData = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found");
            return null;
        }

        const response = await axios.get(`${URL}/analytics/overall`, {
            headers: {
                Authorization: token,
            },
        });

        if (response) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getUserAnalyticsData:", error);
        return null;
    }
};

export const getTopicAnalyticsData = async (topic) => {
    try {
        const token = localStorage.getItem('token')

        if (!token) {
            console.error("No token found");
            return null;
        }

        const response = await axios.get(`${URL}/analytics/topic?topic=${topic}`, {
            headers: {
                Authorization: token,
            },
        });


        if (response) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error)
    }
};

export const getUrlWiseAnalyticsData = async (customAlias) => {
    try {
        const token = localStorage.getItem('token')

        if (!token) {
            console.error("No token found");
            return null;
        }

        const response = await axios.get(`${URL}/analytics/${customAlias}`, {
            headers: {
                Authorization: token,
            },
        });


        if (response) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
    }
}