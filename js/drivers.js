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
var database = firebase.database();

// Reference the 'drivers' node
var dataRef = database.ref("users/driver");

// Reference the search input element
const searchInput = document.querySelector(".search-input");

// Fetch Data from Firebase and Render it into the Table
dataRef.on("value", (snapshot) => {
  const data = snapshot.val();
  const tbody = document.getElementById("dataTableBody");
  tbody.innerHTML = ""; // Clear the existing table content before rendering new data

  // Render the data initially (with no filter)
  renderData(data);

  // Add a search filter
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim().toLowerCase(); // Trim spaces
    renderData(data, searchTerm);
  });
});

// Function to handle showing the driver-edit-container
function showEditContainer() {
  const editContainer = document.querySelector(".driver-edit-container");
  editContainer.style.display = "flex";
}

// Function to handle showing the driver-view-container
function showViewContainer() {
  const viewContainer = document.querySelector(".driver-view-container");
  viewContainer.style.display = "flex";
}

// Function to close the active container
function closeActiveContainer() {
  const editContainer = document.querySelector(".driver-edit-container");
  const viewContainer = document.querySelector(".driver-view-container");

  // Hide both containers
  editContainer.style.display = "none";
  viewContainer.style.display = "none";
}

// Function to render the data into the table
function renderData(data, searchTerm = "") {
  const tbody = document.getElementById("dataTableBody");
  tbody.innerHTML = ""; // Clear the table content

  if (data) {
    // Loop through the data and construct each row
    for (let id in data) {
      const driver = data[id];
      const fullName = `${driver.firstName || ""} ${driver.middleName || ""} ${
        driver.lastName || ""
      }`.toLowerCase();

      // Show all data if searchTerm is empty, or filter the data based on the search term
      if (
        searchTerm === "" || // If searchTerm is empty, show all data
        fullName.includes(searchTerm) ||
        (driver.email && driver.email.toLowerCase().includes(searchTerm)) ||
        (driver.phone && driver.phone.includes(searchTerm))
      ) {
        // Create a new table row with the fetched data
        let row = `
            <tr data-id=${id}>
                <td style="font-size:10px;">${id}</td>
                <td>${driver.firstName || ""}</td>
                <td>${driver.middleName || ""}</td>
                <td>${driver.lastName || ""}</td>
                <td>${driver.email || ""}</td>
                <td>${driver.phoneNumber || ""}</td>
                <td>${driver.role || ""}</td>
                <td>
                    <div class="action-icons">
                        <img src="./img/edit.png" alt="edit" class="edit-icon">
                        <img src="./img/trash-bin.png" alt="delete" class="delete-icon">
                        <img src="./img/more.png" alt="more" class="more-icon">
                    </div>
                </td>
            </tr>`;
        tbody.innerHTML += row;
      }
    }

    // Add event listeners to the edit and more icons after rendering
    document.querySelectorAll(".edit-icon").forEach((icon) => {
      icon.addEventListener("click", showEditContainer);
    });

    document.querySelectorAll(".more-icon").forEach((icon) => {
      icon.addEventListener("click", showViewContainer);
    });
  } else {
    tbody.innerHTML = "<tr><td colspan='7'>No data available</td></tr>";
  }
}

// Close the active container when the close icon is clicked
document.querySelectorAll(".close-icon").forEach((icon) => {
  icon.addEventListener("click", closeActiveContainer);
});
function save() {
  var firstName = document.getElementById("fname").value;
  var middleName = document.getElementById("mname").value;
  var lastName = document.getElementById("lname").value;
  var email = document.getElementById("email").value;
  var phoneNumber = document.getElementById("phoneNumber").value;
  var password = document.getElementById("password").value;
  const jeepContainer = document.querySelector(".info-jeep-container");

  var role = "Driver"; // Set role to Driver
  var wallet_balance = 0; // Default wallet balance

  if (
    firstName !== "" &&
    middleName !== "" &&
    lastName !== "" &&
    email !== "" &&
    phoneNumber !== "" &&
    password !== ""
  ) {
    console.log("All fields are filled, generating QR code..."); // Debug log
    generateQRCode(email).then(qrCodeUrl => {
      console.log("QR code URL received, preparing to upload..."); // Debug log

      // Upload the QR code to Firebase Storage
      uploadQRCodeToStorage(qrCodeUrl, email).then(downloadURL => {
        console.log("QR code uploaded, storage URL received:", downloadURL); // Debug log

        // Create a new user in Firebase Authentication
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            var user = userCredential.user;
            console.log("User created in Firebase Auth:", user.uid);

            // Save the driver data with the QR code download URL in Firebase Database
            database.ref("users/driver").push({
              uid: user.uid,
              firstName: firstName,
              middleName: middleName,
              lastName: lastName,
              email: email,
              phone: phoneNumber,
              password: password,
              role: role,
              qr: downloadURL, // Storage download URL
              wallet_balance: wallet_balance
            });

            jeepContainer.style.display = "none";
            alert("Saved and authenticated successfully!");
          })
          .catch((error) => {
            console.error("Error creating user in Firebase Auth:", error);
            alert("Failed to create user in authentication.");
          });
      }).catch(error => {
        console.error("Error uploading QR code:", error); // Debug log
        alert("Failed to upload QR code.");
      });
    }).catch(error => {
      console.error("Error generating QR code:", error); // Debug log
      alert("Failed to generate QR code.");
    });
  } else {
    console.log("Some fields are missing"); // Debug log
    jeepContainer.style.display = "none";
    alert("Please fill up all the input fields");
  }
}

// Function to generate a QR code
function generateQRCode(text) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(text, { errorCorrectionLevel: 'H' }, function (err, url) {
      if (err) {
        console.error("Error generating QR code:", err);
        reject(err);
      } else {
        resolve(url); // QR code generated successfully
      }
    });
  });
}

// Function to upload QR code to Firebase Storage
function uploadQRCodeToStorage(qrCodeUrl, email) {
  return new Promise((resolve, reject) => {
    // Convert base64 URL to Blob
    const blob = base64ToBlob(qrCodeUrl.split(",")[1], "image/png");

    // Firebase storage reference
    const storageRef = firebase.storage().ref();
    const qrRef = storageRef.child(`qrcodes/${email}_qr.png`); // Save in "qrcodes" folder

    // Upload the Blob to Firebase Storage
    const uploadTask = qrRef.put(blob);

    // Listen for the upload to complete
    uploadTask.on('state_changed', 
      (snapshot) => {
        // Optional: Track progress here
      }, 
      (error) => {
        reject(error); // Handle upload errors
      }, 
      () => {
        // Get the download URL once the upload is complete
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          resolve(downloadURL); // Resolve with the download URL
        });
      }
    );
  });
}

// Helper function to convert base64 to Blob
function base64ToBlob(base64, mime) {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mime });
}

// Add event listener to the table body to handle click events on the edit, delete, and more icons
const confirmDelete = document.querySelector(".confirm-delete");
document
  .getElementById("dataTableBody")
  .addEventListener("click", function (event) {
    const row = event.target.closest("tr");
    const driverID = row ? row.getAttribute("data-id") : null;
    const deleteContainer = document.querySelector(".delete-jeep-container");
    if (event.target && event.target.classList.contains("delete-icon")) {
      deleteContainer.style.display = "flex";
      // Wait for confirmation button click to delete the record
      const confirmDelete = document.querySelector(".confirm-delete");
      confirmDelete.addEventListener(
        "click",
        () => {
          if (driverID) {
            // Delete the record from Firebase
            dataRef
              .child(driverID)
              .remove()
              .then(() => {
                alert("Record deleted successfully.");
              })
              .catch((error) => {
                console.error("Error deleting record: ", error);
              });
          }
          deleteContainer.style.display = "none";
        },
        { once: true }
      );
    }
  });
