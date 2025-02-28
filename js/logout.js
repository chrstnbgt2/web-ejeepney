document.getElementById("logoutButton").addEventListener("click", function () {
    Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, log out",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            // **Session-Based Logout** (PHP session destroy)
            fetch("./config/logout.php", {
                method: "POST",
                credentials: "include"
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    Swal.fire("Logged Out!", "You have been logged out.", "success")
                        .then(() => {
                            window.location.href = "index.php"; // Redirect to login page
                        });
                } else {
                    Swal.fire("Error", "Something went wrong.", "error");
                }
            })
            .catch(error => {
                console.error("Logout Error:", error);
                Swal.fire("Error", "Logout failed!", "error");
            });

        
        }
    });
});
