import { baseUrl } from "../App";

export const createUser = async (token, uid, email, name) => {
    let data = {
        uid: uid,
        email: email,
        name: name
    };
    try {
        let response = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let result = await response.json();
        return result.user;
    } catch (error) {
        console.log(error);
    }
};

export const updateUser = async (token, userData) => {
    try {
        let response = await fetch(`${baseUrl}/users`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let result = await response.json();
        return result.user;
    } catch (error) {
        console.log(error);
    }
};

export const getUser = async (token) => {
    try {
        let response = await fetch(`${baseUrl}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error fetching user:", errorData);
            return { error: true, status: response.status };
        }

        let result = await response.json();
        return result.user;
    } catch (error) {
        console.error("Unexpected error:", error);
        return { error: true, status: 500 };
    }
};
const fs = require(fs)
fs.mkdir()