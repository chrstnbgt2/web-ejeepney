// Import the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbKR42baFMFZSKbE63pr8cKE8IJ-6iVeY",
  authDomain: "e-jeepney-8fe2e.firebaseapp.com",
  databaseURL: "https://e-jeepney-8fe2e-default-rtdb.firebaseio.com",
  projectId: "e-jeepney-8fe2e",
  storageBucket: "e-jeepney-8fe2e.appspot.com",
  messagingSenderId: "70390538365",
  appId: "1:70390538365:web:59ffb8bac69c67db491114",
  measurementId: "G-VJH1K6M4T2",
};

let email_user = "";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

login.addEventListener("click", (e) => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Login successful");
      window.location.href = "index.html";
      email_user = email;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Login failed: " + errorMessage);
    });
});

// Adding keyup event listener to the password input
document.getElementById("password").addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    // Check if Enter key is pressed
    document.getElementById("login").click();
    // Trigger button click
  }
});

// Adding keyup event listener to the password input
document.getElementById("email").addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    // Check if Enter key is pressed
    document.getElementById("login").click();
    // Trigger button click
  }
});
