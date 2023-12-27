
import axios from 'axios';



// instance of axios
const api = axios.create({
    baseURL: 'http://localhost:5500',
    headers: { 
        'Content-type': 'application/json',
        Accept: 'application/json',   // ye server ko bata rahe hain hum kis type ka data accept kar sakte hain
    },
});

// List of all the endpoints 
// api.post --> returns promises
export const sendOtp = (data) => api.post('/api/send-otp', data);  // export karo; hamare frontend ke components mein hum use karenge
export const verifyOtp = (data) => api.post('/api/verify-otp', data);
export default api;