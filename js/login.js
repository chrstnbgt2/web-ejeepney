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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const popupModal = document.getElementById("popupModal");
const popupMessage = document.getElementById("popupMessage");
const closeModal = document.getElementById("closeModal");

function showPopup(message) {
  popupMessage.textContent = message;
  popupModal.style.display = "block";
}

closeModal.onclick = function() {
  popupModal.style.display = "none";
};

window.onclick = function(event) {
  if (event.target == popupModal) {
    popupModal.style.display = "none";
  }
};

login.addEventListener("click", async (e) => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    showPopup("Login successful");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500); 
    email_user = email;
  } catch (error) {
    const errorCode = error.code;
    
    if (errorCode === "auth/invalid-email") {
      showPopup("Invalid email format");
    } else {
      showPopup("Invalid user credentials");
    }
  }
});

document.getElementById("password").addEventListener("keyup", function (event) {
  if (event.keyCode === 13) { 
    document.getElementById("login").click();  
  }
});

document.getElementById("email").addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {  
    document.getElementById("login").click(); 
  }
});

