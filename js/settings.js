// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Get references to form elements
const roleSelect = document.getElementById('editAdminSelect');
const emailList = document.getElementById('emailList');

// Function to fetch users by role and display emails
function fetchUsersByRole(role) {
    const usersRef = database.ref('users/' + role); // Adjust the path according to your Firebase structure
    usersRef.once('value', function(snapshot) {
        emailList.innerHTML = ''; // Clear previous list
        if (snapshot.exists()) {
            snapshot.forEach(function(childSnapshot) {
                const userData = childSnapshot.val();
                const email = userData.email;
                const li = document.createElement('li');
                li.textContent = email;
                emailList.appendChild(li);
            });
        } else {
            emailList.innerHTML = '<li>No users found for this role</li>';
        }
    });
}

// Event listener for role change
roleSelect.addEventListener('change', function() {
    const selectedRole = roleSelect.value;
    fetchUsersByRole(selectedRole);
});

// Fetch default (admin) users on page load
fetchUsersByRole('admin');
