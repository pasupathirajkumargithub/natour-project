import "@babel/polyfill";
import { displayMap } from "./mapBox";
import { login, logout } from "./login";
import { signup } from "./signup";
import { updateSettings } from "./updateData";
import { bookTour } from "./stripe";

const mapBox = document.getElementById("map");
const logInForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPaswordForm = document.querySelector(".form-user-password");
const bookBtn = document.getElementById("book-tour");

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
if (logInForm) {
  logInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const mail = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(mail, password);
    login(mail, password);
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const mail = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("confirmPassword").value;
    console.log(name, mail, password, passwordConfirm);
    signup(name, mail, password, passwordConfirm);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener("click", logout);
}

if (userDataForm) {
  userDataForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("mail", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);

    updateSettings(form, "data");
  });
}

if (userPaswordForm) {
  userPaswordForm.addEventListener("submit", function (e) {
    e.preventDefault();
    document.querySelector(".btn-save--password").textContent = "Updating...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    updateSettings({ passwordCurrent, password, passwordConfirm }, "password");

    document.querySelector(".btn-save--password").textContent = "Save password";
  });
}

if (bookBtn) {
  bookBtn.addEventListener("click", async function (e) {
    console.log("button clicked");
    e.target.textContent = "Processing..!";
    const tourID = e.target.dataset.tourId;
    console.log(tourID);

    const data = await bookTour(tourID);
    window.location.href = `${data.session.url}`;
  });
}
