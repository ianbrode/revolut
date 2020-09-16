import axios from "axios";
const appId = (window as any)._env_.REACT_APP_ID;
const domain = (window as any)._env_.REACT_APP_API_DOMAIN;

export const api = {
  get: (url: string) => axios.get(url),
};

export const exchangeRates = (base: string) => {
  return api.get(`${domain}/api/latest.json?app_id=${appId}&base=${base}`);
};
