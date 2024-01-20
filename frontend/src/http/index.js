import axios from 'axios';

// instance of axios
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: { 
        'Content-type': 'application/json',
        Accept: 'application/json',   // ye server ko bata rahe hain hum kis type ka data accept kar sakte hain
    },
});

// List of all the endpoints 
// api.post --> returns promises
export const sendOtp = (data) => api.post('/api/send-otp', data);  // export karo; hamare frontend ke components mein hum use karenge
export const verifyOtp = (data) => api.post('/api/verify-otp', data);
export const activate = (data) => api.post('/api/activate', data);
export const logout = () => api.post('/api/logout');
export const createRoom = (data) => api.post('/api/rooms', data);
export const getAllRooms = () => api.get('/api/rooms');
export const getRoom = (roomId) => api.get(`/api/rooms/${roomId}`);


/* Interceptors
api.interceptors.response.use(()=>{},()=>{}) --> two functions deni hain
config --> wo puri info hamare response ke bare mein and request ke bare mein bhi 
*/

api.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        const originalRequest = error.config;  // hamara original request in this case /api/activate
        if (
            error.response.status === 401 &&
            originalRequest &&
            !originalRequest._isRetry    // originalRequest._isRetry --> false --> agar accessToken ko refresh karne ke baad bhi error agaya iska matlab retry i.e. refreshToken bhi expire hogaya
        ) {
            originalRequest._isRetry = true;
            try {
                await axios.get(`${process.env.REACT_APP_API_URL}/api/refresh`,
                    {
                        withCredentials: true,
                    }
                );
                return api.request(originalRequest);  // after refreshing token  phir se /api/activate pe request maro
            } catch (err) {
                console.log(err.message);
            }
        }
        throw error;     // originalRequest._isRetry --> true hain yani phir se retry kiya gaya hain i.e. abki baar refreshToken hi expired hain
    })
export default api;