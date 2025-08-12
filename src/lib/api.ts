import axios from "axios";

const api = axios.create({
	baseURL: "https://mokingdata-ehej.onrender.com", // Your backend URL
});

export default api;
