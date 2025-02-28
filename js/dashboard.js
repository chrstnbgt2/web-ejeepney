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
/**
 * Fetch and display users registered today in descending order.
 */


 function displayUsers() {
  const usersContainer = document.getElementById("usersContainer");
  usersContainer.innerHTML = "";

  const todayDate = new Date().toISOString().split("T")[0];  

  database
    .ref("users/accounts")
    .once("value")
    .then((snapshot) => {
      let usersArray = [];

      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();

        // ✅ Use createdAt instead of timestamp
        if (user.role && user.createdAt) {
          const userDate = new Date(user.createdAt).toISOString().split("T")[0];

           if (userDate === todayDate) {
            usersArray.push(user);
          }
        }
      });

       usersArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (usersArray.length > 0) {
        usersArray.forEach((user) => {
          const userDiv = document.createElement("div");
          userDiv.classList.add("item1");

          userDiv.innerHTML = `
            <p><strong>Name:</strong> ${user.firstName || "N/A"} ${
            user.middleName || ""
          } ${user.lastName || "N/A"}</p>
             <p><strong>Registered on:</strong> ${new Date(
              user.createdAt
            ).toLocaleString()}</p>
          `;

          usersContainer.appendChild(userDiv);
        });
      } else {
        usersContainer.innerHTML = `<p>No users registered today.</p>`;
      }
    })
    .catch((error) => {
      console.error("Error displaying users:", error);
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
  
  initializeDashboard();
});

// Run the functions when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
 
  updateCounts();
  displayUsers(); 
});
