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
// initialize config
firebase.initializeApp(firebaseConfig);

// Set database variable
var database = firebase.database();

function notif() {
  alert("you clicked the button.");
}

var usersCount = 0;

function updateJeepneyCount() {
  return firebase
    .database()
    .ref("jeepneys")
    .once("value")
    .then((snapshot) => {
      const jeepneyCount = snapshot.numChildren(); // Count number of entries under '/users/jeepney'
      document.querySelector(
        ".jeep .column-data .display_count:last-of-type"
      ).innerText = jeepneyCount;
      usersCount += jeepneyCount;
    });
}

function updateDriverCount() {
  return firebase
    .database()
    .ref("/users/driver")
    .once("value")
    .then((snapshot) => {
      const driverCount = snapshot.numChildren(); // Count number of entries under '/users/driver'
      document.querySelector(
        ".driver .column-data .display_count:last-of-type"
      ).innerText = driverCount;
      usersCount += driverCount;
    });
}

function updateConductorsCount() {
  return firebase
    .database()
    .ref("/users/conductor")
    .once("value")
    .then((snapshot) => {
      const conductorCount = snapshot.numChildren(); // Count number of entries under '/users/conductor'
      document.querySelector(
        ".conduc .column-data .display_count:last-of-type"
      ).innerText = conductorCount;
      usersCount += conductorCount;
    });
}

function updateUsersCount() {
  document.querySelector(
    ".users .column-data .display_count:last-of-type"
  ).innerText = usersCount;
}

// Use Promises to ensure updateUsersCount() is called after all counts are updated
Promise.all([
  updateJeepneyCount(),
  updateDriverCount(),
  updateConductorsCount(),
])
  .then(() => {
    updateUsersCount();
  })
  .catch((error) => {
    console.error("Error updating counts:", error);
  });

// References to the different user roles in the database
const dbRefs = [
  firebase.database().ref("users/conductor"),
  firebase.database().ref("users/driver"),
  firebase.database().ref("users/passenger"),
];

// Function to get and display users from each role
function getAndDisplayUsers() {
  const usersContainer = document.getElementById("usersContainer");
  usersContainer.innerHTML = ""; // Clear previous content

  dbRefs.forEach((dbRef) => {
    dbRef.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();

        // Check if the user has a registered date
        if (user.timestamp) {
          // Create a div to display each user
          const userDiv = document.createElement("div");
          userDiv.classList.add("item1");

          userDiv.innerHTML = `
            <p><strong>Name:</strong> ${user.firstName} ${user.middleName} ${
            user.lastName
          }</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Registered on:</strong> ${new Date(
              user.timestamp
            ).toLocaleString()}</p>
          `;

          usersContainer.appendChild(userDiv);
        }
      });
    });
  });
}

// Fetch and display users on page load
document.addEventListener("DOMContentLoaded", () => {
  getAndDisplayUsers();
});
