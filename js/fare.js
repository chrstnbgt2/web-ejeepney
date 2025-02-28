const firebaseConfig = {
            apiKey: "AIzaSyAbKR42baFMFZSKbE63pr8cKE8IJ-6iVeY",
            authDomain: "e-jeepney-8fe2e.firebaseapp.com",
            databaseURL: "https://e-jeepney-8fe2e-default-rtdb.firebaseio.com",
            projectId: "e-jeepney-8fe2e",
            storageBucket: "e-jeepney-8fe2e.appspot.com",
            messagingSenderId: "70390538365",
            appId: "1:70390538365:web:59ffb8bac69c67db491114",
            measurementId: "G-VJH1K6M4T2"
          };
          // Initialize Firebase
          firebase.initializeApp(firebaseConfig);
      
          // Set database variable
          var database = firebase.database();
  




 
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
 
  initializeDashboard();
});

// Run the functions when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
 
  displayUsers(); 
});





 

          function toggleEdit(type) {
            const firstKmInput = document.getElementById(`${type}-first-km`);
            const succeedingKmInput = document.getElementById(`${type}-succeeding-km`);
            const saveButton = document.getElementById(`${type}-save-button`);
      
            if (firstKmInput.readOnly) {
              firstKmInput.readOnly = false;
              succeedingKmInput.readOnly = false;
              saveButton.style.display = 'inline-block';
              firstKmInput.style.backgroundColor = '#fff';
              succeedingKmInput.style.backgroundColor = '#fff';
            } else {
              firstKmInput.readOnly = true;
              succeedingKmInput.readOnly = true;
              saveButton.style.display = 'none';
              firstKmInput.style.backgroundColor = '';
              succeedingKmInput.style.backgroundColor = '';
            }
          }
      
          function saveFare(type) {
            const firstKmInput = document.getElementById(`${type}-first-km`);
            const succeedingKmInput = document.getElementById(`${type}-succeeding-km`);
      
            const fareData = {
              firstKm: parseFloat(firstKmInput.value),
              succeedingKm: parseFloat(succeedingKmInput.value)
            };
      
            database.ref('fares/' + type).set(fareData, (error) => {
              if (error) {
                alert('Error saving data: ' + error.message);
              } else {
                alert(`${type.charAt(0).toUpperCase() + type.slice(1)} fare saved successfully!`);
                firstKmInput.readOnly = true;
                succeedingKmInput.readOnly = true;
                firstKmInput.style.backgroundColor = '';
                succeedingKmInput.style.backgroundColor = '';
              }
            });

            // Update discount fare if regular fare is updated
            if (type === 'regular') {
              updateDiscountFare(fareData);
            }
          }

          function updateDiscountFare(regularFare) {
            const discountFare = {
              firstKm: parseFloat((regularFare.firstKm * 0.8).toFixed(2)),
              succeedingKm: parseFloat((regularFare.succeedingKm * 0.8).toFixed(2))
            };

            database.ref('fares/discount').set(discountFare, (error) => {
              if (error) {
                alert('Error saving discount fare: ' + error.message);
              } else {
                document.getElementById('discount-first-km').value = discountFare.firstKm.toFixed(2);
                document.getElementById('discount-succeeding-km').value = discountFare.succeedingKm.toFixed(2);
                console.log('Discount fare updated successfully!');
              }
            });
          }

          function loadFareData(type) {
            database.ref('fares/' + type).once('value').then((snapshot) => {
              const fareData = snapshot.val();
              if (fareData) {
                document.getElementById(`${type}-first-km`).value = fareData.firstKm.toFixed(2);
                document.getElementById(`${type}-succeeding-km`).value = fareData.succeedingKm.toFixed(2);
              }
            }).catch((error) => {
              console.log('Error fetching data: ' + error.message);
            });
          }
      
          // Load initial data
          loadFareData('regular');
          loadFareData('discount');


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
 