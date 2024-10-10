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

// Reference the 'drivers' node
var dataRef = database.ref("drivers");

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
      const driver = data[id];
      const fullName = `${driver.firstName || ''} ${driver.middleName || ''} ${driver.lastName || ''}`.toLowerCase();

      // Show all data if searchTerm is empty, or filter the data based on the search term
      if (
        searchTerm === "" ||  // If searchTerm is empty, show all data
        fullName.includes(searchTerm) || 
        (driver.email && driver.email.toLowerCase().includes(searchTerm)) ||
        (driver.phone && driver.phone.includes(searchTerm))
      ) {
        // Create a new table row with the fetched data
        let row = `
            <tr>
                <td>${id}</td>
                <td>${driver.firstName || ''}</td>
                <td>${driver.middleName || ''}</td>
                <td>${driver.lastName || ''}</td>
                <td>${driver.email || ''}</td>
                <td>${driver.phone || ''}</td>
                <td>
                    <div class="action-icons">
                        <img src="./img/edit.png" alt="edit">
                        <img src="./img/trash-bin.png" alt="delete">
                        <img src="./img/more.png" alt="more">
                    </div>
                </td>
            </tr>`;
        tbody.innerHTML += row;
      }
    }
  } else {
    tbody.innerHTML = "<tr><td colspan='7'>No data available</td></tr>";
  }
}

// Function to save new driver data
function save() {
  var firstName = document.getElementById('fname').value;
  var middleName = document.getElementById('mname').value;
  var lastName = document.getElementById('lname').value;
  var email = document.getElementById('email').value;
  var phoneNumber = document.getElementById('phoneNumber').value;
  var password = document.getElementById('password').value;
  const jeepContainer = document.querySelector('.info-jeep-container');

  if (firstName !== "" && middleName !== "" && lastName !== "" && email !== "" && phoneNumber !== "" && password !== "") {
    database.ref('drivers/').push({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      email: email,
      phone: phoneNumber,
      password: password,
    });
    jeepContainer.style.display = 'none';
    alert('Saved');
  } else {
    jeepContainer.style.display = 'none';
    alert("Please fill up all the input fields");
  }
}
