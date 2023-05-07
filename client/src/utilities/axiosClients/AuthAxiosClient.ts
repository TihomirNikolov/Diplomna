import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { baseURL } from "../urls";
import { getAccessToken, getRefreshToken, removeTokenObject, setRefreshToken, setTokenObject } from "../services";
import { TokenModel } from "../authentication";
import axiosClient from "./AxiosClient";
import { User } from "../../contexts";


const authClient = axios.create();

authClient.defaults.withCredentials = true;

export default authClient;