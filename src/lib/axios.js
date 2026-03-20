import axios from "axios";

const baseURL = process.env.BASE_URL || "http://localhost:9999/";

export const instance = axios.create({
  baseURL: baseURL,
});
