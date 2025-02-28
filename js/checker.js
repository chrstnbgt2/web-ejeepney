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

// ✅ Ensure Firebase is Initialized Before Use
firebase.initializeApp(firebaseConfig);

// ✅ Firebase Services
const auth = firebase.auth();
const database = firebase.database();

/**
 * ✅ Check if user is logged in
 */
function checkUserLoggedIn() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("✅ User logged in:", user.email);

      const welcomeMessage = document.getElementById("welcomeMessage");
      if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${user.email}`;
      }
    } else {
      console.warn("⚠️ No user found! Redirecting to login.");
      window.location.href = "./login.html";
    }
  });
}

/**
 * ✅ Logout user when clicking "Sign Out"
 */
function setupLogoutButton() {
  const logoutButton = document.getElementById("logoutButton");

  if (!logoutButton) {
    console.warn("❌ Logout button not found!");
    return;
  }

  logoutButton.addEventListener("click", async () => {
    try {
      console.log("🔑 Logging out...");
      await auth.signOut();
      console.log("✅ Successfully logged out.");
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "./login.html";
    } catch (error) {
      console.error("❌ Error logging out:", error);
      alert("Logout failed!");
      window.location.href = "./login.html";
    }
  });
}

/**
 * ✅ Initialize Dashboard
 */
function initializeDashboard() {
  console.log("📊 Initializing dashboard...");

  const dbRef = database.ref("users/accounts");
  dbRef.once("value", (snapshot) => {
    if (snapshot.exists()) {
      console.log("✅ Database data loaded:", snapshot.val());
    } else {
      console.warn("⚠️ No data found in Firebase.");
    }
  });
}

// ✅ Run Functions on Page Load
document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 DOM loaded, running functions...");
  checkUserLoggedIn();
  setupLogoutButton();
  initializeDashboard();
});
