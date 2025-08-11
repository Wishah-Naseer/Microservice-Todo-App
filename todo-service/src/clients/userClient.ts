import axios from 'axios';

// Base URL for user service API calls
const base = process.env.USER_SERVICE_URL;

// User data transfer object
export interface UserDto {
    id: string;
    email: string;
    createdAt: Date;
}

// Fetch user details from user service by ID
export async function fetchUserById(userId: string) {
    const res = await axios.get<{ status: string; data: UserDto }>(
        `${base}/user/${userId}`
    );
    return res.data.data;
}
