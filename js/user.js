// Firebase configuration
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
var database = firebase.database();

// Reference the 'users' node
var dataRef = database.ref("users/passenger");

// Reference the search input element
const searchInput = document.querySelector('.search-input');

// Fetch Data from Firebase and Render it into the Table
dataRef.on("value", (snapshot) => {
  const data = snapshot.val();
  const tbody = document.getElementById("dataTableBody");
  tbody.innerHTML = ""; // Clear the existing table content before rendering new data

  // Render the data initially (with no filter)
  renderData(data);

  // Add a search filter
  searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.trim().toLowerCase(); // Trim spaces
      renderData(data, searchTerm);
  });
});

// Function to render the data into the table
function renderData(data, searchTerm = "") {
  const tbody = document.getElementById("dataTableBody");
  tbody.innerHTML = ""; // Clear the table content

  if (data) {
      // Loop through the data and construct each row
      for (let id in data) {
          const user = data[id];
          const fullName = `${user.firstName || ''} ${user.middleName || ''} ${user.lastName || ''}`.toLowerCase();

          // Show all data if searchTerm is empty, or filter the data based on the search term
          if (
              searchTerm === "" ||  // If searchTerm is empty, show all data
              fullName.includes(searchTerm) || 
              (user.email && user.email.toLowerCase().includes(searchTerm)) ||
              (user.phoneNumber && user.phoneNumber.includes(searchTerm))
          ) {
              // Create a new table row with the fetched data
              let row = `
                  <tr>
                      <td>${id}</td>
                      <td>${user.firstName || ''}</td>
                      <td>${user.middleName || ''}</td>
                      <td>${user.lastName || ''}</td>
                      <td>${user.email || ''}</td>
                      <td>${user.phoneNumber || ''}</td>
                      <td>${user.role || ''}</td>
                  </tr>`;
              tbody.innerHTML += row;
          }
      }
  } else {
      tbody.innerHTML = "<tr><td colspan='7'>No data available</td></tr>";
  }
}
