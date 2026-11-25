// main.js
// This is the entry point. It reads the URL hash (e.g. "#dashboard")
// and shows the correct page. It also builds the top navigation bar.

import "./style.css";
import { getCurrentUser } from "./storage.js";
import { logout } from "./auth.js";
import {
  landingPage, signupPage, signupPageInit, loginPage, loginPageInit,
  dashboardPage, dashboardPageInit, entityPage, entityPageInit,
  componentPage, componentPageInit, myFeedbackPage,
} from "./userPages.js";
import {
  adminLoginPage, adminLoginPageInit, adminDashboardPage, adminDashboardPageInit,
  adminManagePage, adminManagePageInit, adminFeedbackPage, adminFeedbackPageInit,
  adminRequestsPage, adminRequestsPageInit,
} from "./adminPages.js";


const app = document.getElementById("app");


function navbar(active) {
  const user = getCurrentUser();
  let links = "";
  let right = "";

 
  function navItem(hash, label) {
    const isActive = active === hash || (hash === "admin" && active === "admin");
    return `<a href="#${hash}" data-nav="${hash}" class="${isActive ? "active" : ""}">${label}</a>`;
  }

  if (!user) {
    right = `
      <a href="#login" data-nav="login" class="${active === "login" ? "active" : ""}">Log In</a>
      <a href="#signup" data-nav="signup" class="${active === "signup" ? "active" : ""}">Sign Up</a>`;
  } else if (user.role === "admin") {
    links =
      navItem("admin", "Dashboard") +
      navItem("admin/manage", "Entities") +
      navItem("admin/feedback", "Feedback") +
      navItem("admin/requests", "Requests");
    right = `<span class="nav-user">${user.name}</span><button class="btn btn-sm" id="logout-btn">Log Out</button>`;
  } else {
    links =
      navItem("dashboard", "Dashboard") +
      navItem("my-feedback", "My Feedback");
    right = `<span class="nav-user">${user.name}</span><button class="btn btn-sm" id="logout-btn">Log Out</button>`;
  }

  return `
  <nav class="navbar">
    <div class="nav-brand">
      <img src="/prism_logo.png" alt="PRISM" class="nav-logo" />
      <a href="#" data-nav="">PRISM</a>
    </div>
    <div class="nav-links">${links}</div>
    <div class="nav-right">${right}</div>
  </nav>`;
}


function render() {
  const hash = location.hash.replace(/^#/, "") || "";
  const parts = hash.split("/");
  const route = parts[0];
  const param = parts[1];

  let html = navbar(route);
  let init = null;

  const user = getCurrentUser();

  switch (route) {
    case "":
    case "landing":
      html += landingPage();
      break;

    case "signup":
      if (user) { location.hash = user.role === "admin" ? "#admin" : "#dashboard"; return; }
      html += signupPage();
      init = signupPageInit;
      break;

    case "login":
      if (user) { location.hash = user.role === "admin" ? "#admin" : "#dashboard"; return; }
      html += loginPage();
      init = loginPageInit;
      break;

    case "admin-login":
      html += adminLoginPage();
      init = adminLoginPageInit;
      break;

 
    case "dashboard":
      if (!user || user.role !== "user") { location.hash = "#login"; return; }
      html += dashboardPage();
      init = dashboardPageInit;
      break;

    case "entity":
      if (!user) { location.hash = "#login"; return; }
      html += entityPage(param);
      init = () => entityPageInit(param);
      break;

    case "component":
      if (!user) { location.hash = "#login"; return; }
      html += componentPage(param);
      init = () => componentPageInit(param);
      break;

    case "my-feedback":
      if (!user || user.role !== "user") { location.hash = "#login"; return; }
      html += myFeedbackPage();
      break;


    case "admin":
      if (!user || user.role !== "admin") { location.hash = "#admin-login"; return; }
      if (!param) {
        html += adminDashboardPage();
        init = adminDashboardPageInit;
      } else if (param === "manage") {
        html += adminManagePage();
        init = adminManagePageInit;
      } else if (param === "feedback") {
        html += adminFeedbackPage();
        init = adminFeedbackPageInit;
      } else if (param === "requests") {
        html += adminRequestsPage();
        init = adminRequestsPageInit;
      }
      break;

    default:
      html += `<p class="muted">Page not found.</p>`;
  }

  app.innerHTML = html;


  if (init) init();

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logout();
      location.hash = "";
    });
  }


  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const target = el.getAttribute("data-nav");
      const id = el.getAttribute("data-id");
      if (target === "") {
        location.hash = "";
      } else if (id) {
        location.hash = "#" + target + "/" + id;
      } else {
        location.hash = "#" + target;
      }
    });
  });


  window.scrollTo(0, 0);
}


window.addEventListener("hashchange", render);


render();
