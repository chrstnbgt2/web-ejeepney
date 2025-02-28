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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference Firebase services
const auth = firebase.auth();
const database = firebase.database();

/**
 * Check if a user is logged in, otherwise redirect to the login page.
 */
function checkUserLoggedIn() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("Logged-in user:", user.email);

      // Update the welcome message
      const welcomeMessage = document.getElementById("welcomeMessage");
      if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${user.email}`;
      }
    } else {
      console.warn("No user is logged in. Redirecting to login page.");
      window.location.href = "index.html";
    }
  });
}

/**
 * Updates counts for each role: driver, conductor, user, and jeepneys.
 */
function updateCounts() {
  const roleCounts = {
    driver: 0,
    conductor: 0,
    user: 0,
  };
  let jeepneyCount = 0;

  const accountsPromise = database
    .ref("users/accounts")
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        const role = user.role;

        if (roleCounts.hasOwnProperty(role)) {
          roleCounts[role]++;
        }
      });
    });

  const jeepneysPromise = database
    .ref("jeepneys")
    .once("value")
    .then((snapshot) => {
      jeepneyCount = snapshot.numChildren();
    });

  Promise.all([accountsPromise, jeepneysPromise])
    .then(() => {
      document.querySelector(".driver .display_count").textContent =
        roleCounts.driver;
      document.querySelector(".conduc .display_count").textContent =
        roleCounts.conductor;
      document.querySelector(".users .display_count").textContent =
        roleCounts.user;
      document.querySelector(".jeep .display_count").textContent = jeepneyCount;

      console.log("Counts Updated:", {
        drivers: roleCounts.driver,
        conductors: roleCounts.conductor,
        users: roleCounts.user,
        jeepneys: jeepneyCount,
      });
    })
    .catch((error) => {
      console.error("Error updating counts:", error);
    });
}

/**
 * Fetch and display users with valid roles.
 */
function displayUsers() {
  const usersContainer = document.getElementById("usersContainer");
  usersContainer.innerHTML = "";

  database
    .ref("users/accounts")
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();

        if (user.role && user.timestamp) {
          const userDiv = document.createElement("div");
          userDiv.classList.add("item1");

          userDiv.innerHTML = `
            <p><strong>Name:</strong> ${user.firstName || "N/A"} ${
            user.middleName || ""
          } ${user.lastName || "N/A"}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Registered on:</strong> ${new Date(
              user.timestamp
            ).toLocaleString()}</p>
          `;

          usersContainer.appendChild(userDiv);
        }
      });
    })
    .catch((error) => {
      console.error("Error displaying users:", error);
    });
}

/**
 * Logout function to log out the user and redirect to the login page.
 */
function setupLogoutButton() {
  const logoutButton = document.getElementById("logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try {
        await auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        console.log("User logged out successfully.");
        window.location.href = "index.html";
      } catch (error) {
        console.error("Error logging out:", error);
        alert("Logout failed. Redirecting to the login page.");
        window.location.href = "index.html";
      }
    });
  }
}

// Run the functions when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  checkUserLoggedIn();
  updateCounts();
  displayUsers();
  setupLogoutButton();
});
