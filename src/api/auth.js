import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Register new company user
export async function registerUser(data) {
    try {
        const response = await axios.post(`${API_BASE_URL}Register/`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data; // contains { message: "User registered successfully" }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || "Registration failed");
        }
        throw new Error("Network error");
    }
}

export async function loginUser(data) {
    try {
        const response = await axios.post(`${API_BASE_URL}Login/`, data, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data; // { access_token, expires_in_days }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || "Login failed");
        }
        throw new Error("Network error");
    }
}