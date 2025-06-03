import axios from "axios";
import { toast } from "react-toastify";

export const tostcm = (succ, msg) => {
  if (succ) {
    toast.success(msg);
  } else {
    toast.error(msg);
  }
};

export const getToken = () => localStorage.getItem("token") || {};
export const getUser = () => JSON.parse(localStorage.getItem("user")) || {};

export const setAuth = ({ token, user }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
