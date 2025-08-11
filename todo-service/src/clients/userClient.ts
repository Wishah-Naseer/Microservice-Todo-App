import axios from 'axios';
const base = process.env.USER_SERVICE_URL;
export interface UserDto {
    id: string;
    email: string;
    createdAt: Date;
}

export async function fetchUserById(userId: string) {
    const res = await axios.get<{ status: string; data: UserDto }>(
        `${base}/user/${userId}`
    );
    return res.data.data;
}
