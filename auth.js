// auth.js
// Handles signup and login for users, and login for admin.
// Uses the storage functions from storage.js.

import {
  addUser, findUserByEmail, setCurrentUser, clearCurrentUser, getCurrentUser,
} from "./storage.js";


function signup(name, email, password) {
  if (!name || !email || !password) return "Please fill all fields.";
  if (findUserByEmail(email)) return "Email already registered.";
  const user = {
    id: "u" + Date.now(),
    name,
    email,
    password,
    role: "user",
  };
  addUser(user);
  setCurrentUser(user);
  return true;
}


function login(email, password) {
  const user = findUserByEmail(email);
  if (!user) return "No account found for this email.";
  if (user.password !== password) return "Wrong password.";
  setCurrentUser(user);
  return true;
}


function logout() {
  clearCurrentUser();
}


function isLoggedIn() {
  return getCurrentUser() !== null;
}


function isAdmin() {
  const u = getCurrentUser();
  return u && u.role === "admin";
}

export { signup, login, logout, isLoggedIn, isAdmin };
