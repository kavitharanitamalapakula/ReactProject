export const fetchWithToken = async (url, options = {}) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token;
    const defaultHeaders = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
    };

    const finalOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        }
    };

    try {
        const response = await fetch(url, finalOptions);
        const data = await response.json();
        console.log(data)
        if (!response.ok) {
            throw new Error(data.message || "Request failed");
        }
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};
