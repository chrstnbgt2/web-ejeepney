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
const database = firebase.database();
const jeepneyRef = database.ref("jeepneys");

// Global variable to store the fetched data
let currentData = {};

// Reference the search input element
const searchInput = document.querySelector('.search-input');

// Add event listener for search input outside of Firebase data retrieval
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  renderJeepneyData(currentData, searchTerm);
});

// Fetch data from Firebase and render it to the table
jeepneyRef.on("value", (snapshot) => {
  currentData = snapshot.val();
  renderJeepneyData(currentData); // Render data initially without filter
});

// Function to render the data into the table
function renderJeepneyData(data, searchTerm = "") {
  const tbody = document.getElementById("dataTableBody");
  tbody.innerHTML = ""; // Clear the table content

  if (data) {
    // Loop through the data and construct each row
    for (let id in data) {
      const jeepney = data[id];

      const plateNumber = (jeepney.plateNumber || '').toString().toLowerCase();
      const capacity = (jeepney.capacity || '').toString().toLowerCase();
      const route = (jeepney.route || '').toString().toLowerCase();
      const status = (jeepney.status || '').toString().toLowerCase();

      // Check if the search term matches any of the fields
      if (
        searchTerm === "" ||  // If searchTerm is empty, show all data
        plateNumber.includes(searchTerm) || 
        capacity.includes(searchTerm) ||
        route.includes(searchTerm) ||
        status.includes(searchTerm)
      ) {
        // Create a new table row with the fetched data
        const row = `
          <tr data-id="${id}">
            <td>${id}</td>
            <td>${jeepney.plateNumber || ''}</td>
            <td>${jeepney.capacity || ''}</td>
            <td>${jeepney.route || ''}</td>
            <td>${jeepney.status || ''}</td>
            <td>
              <div class="action-icons">
                <img src="./img/edit.png" alt="edit" class="edit-icon">
                <img src="./img/trash-bin.png" alt="delete" class="delete-icon">
                <img src="./img/more.png" alt="more">
              </div>
            </td>
          </tr>`;
        tbody.innerHTML += row;
      }
    }
  } else {
    tbody.innerHTML = "<tr><td colspan='6'>No data available</td></tr>";
  }
}
document.addEventListener("DOMContentLoaded", function() {
  const infoJeepContainer = document.getElementById("editJeepContainer");
  const viewJeepContainer = document.getElementById("viewJeepContainer");
  const editCloseIcon = document.getElementById("editCloseIcon");
  const viewCloseIcon = document.getElementById("viewCloseIcon");

  // Event listener for the edit close icon
  editCloseIcon.addEventListener("click", function() {
    infoJeepContainer.style.display = "none";
  });

  // Event listener for the view close icon
  viewCloseIcon.addEventListener("click", function() {
    viewJeepContainer.style.display = "none";
  });

  // Add event listener to the table body to handle click events on the edit, delete, and more icons
  document.getElementById("dataTableBody").addEventListener("click", function(event) {
    const row = event.target.closest("tr");
    const jeepneyId = row ? row.getAttribute("data-id") : null;

    if (event.target && event.target.classList.contains("edit-icon")) {
      infoJeepContainer.style.display = 'flex';
      // Populate the form with data from the clicked row
      const cells = row.getElementsByTagName("td");
      document.getElementById("plateNumber").value = cells[1].innerText;
      document.getElementById("capacity").value = cells[2].innerText;
      document.getElementById("route").value = cells[3].innerText;
      document.getElementById("status").value = cells[4].innerText;

    } else if (event.target && event.target.classList.contains("delete-icon")) {
      if (jeepneyId && confirm("Are you sure you want to delete this record?")) {
        // Delete the record from Firebase
        jeepneyRef.child(jeepneyId).remove()
          .then(() => {
            alert("Record deleted successfully.");
          })
          .catch((error) => {
            console.error("Error deleting record: ", error);
          });
      }

    } else if (event.target && event.target.alt === "more") {
      // Show the view container with data populated
      viewJeepContainer.style.display = 'flex';
      const cells = row.getElementsByTagName("td");
      document.getElementById("plateNumber").value = cells[1].innerText;
      document.getElementById("capacity").value = cells[2].innerText;
      document.getElementById("route").value = cells[3].innerText;
      document.getElementById("status").value = cells[4].innerText;
      document.getElementById("driver").value = "Sample Driver";  // Populate the driver field as needed
    }
  });
});
