import axios from "axios";

const axiosClient = axios.create();

axiosClient.defaults.withCredentials = true;

export default axiosClient;