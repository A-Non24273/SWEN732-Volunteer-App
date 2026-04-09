import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true
});

export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);

// POST REQUEST
export const createListing = (data) =>
  API.post("/listing", data);

export const getListings = (status = "open") =>
  API({
    method: "get",
    url: "/listings",
    data: { status }
  });

export const signupVolunteer = (listing_id) =>
  API.post("/volunteers", { listing_id });

export const getVolunteers = (listing_id) =>
  API({
    method: "get",
    url: "/volunteers",
    data: { listing_id }
  });

export const updateVolunteerStatus = (data) =>
  API.put("/volunteers", data);

