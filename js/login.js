// Import the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

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

    const dbRef = ref(database, 'users/admin');
    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        let userFound = false;
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (userData.email === email) {
            console.log("User data found:", userData); 
            if (userData.role === "admin") {
              localStorage.setItem("username", userData.username);
              showPopup("Login successful");
              setTimeout(() => {
                window.location.href = "index.html";
              }, 1500);
              userFound = true;
              return;
            } else {
              showPopup("You do not have admin privileges");
              userFound = true;
              return;
            }
          }
        });
        if (!userFound) {
          showPopup("User doesn't have privilege to Login");
        }
      } else {
        showPopup("No user data found");
      }
    });

  } catch (error) {
    const errorCode = error.code;
    console.error("Login error:", error);

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
