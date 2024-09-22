<?php
session_start();
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];

    if ($new_password !== $confirm_password) {
        header("Location: /web-final/setting.php?error=password_mismatch");
        exit();
    }

    $host = "localhost";
    $dbuser = "root";
    $dbpass = "";
    $dbname = "ejeepsdb";

    $conn = new mysqli($host, $dbuser, $dbpass, $dbname);

    if ($conn->connect_error) {
        die("Connection Failed: " . $conn->connect_error);
    }
    $stmt = $conn->prepare("SELECT * FROM accounts WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $stmt_update = $conn->prepare("UPDATE accounts SET password = ? WHERE username = ?");
        $stmt_update->bind_param("ss", $new_password, $username);
        if ($stmt_update->execute()) {
            header("Location: /web-final/setting.php?success=1"); 
            exit();
        } else {
            header("Location: /web-final/setting.php?error=update_failed"); 
            exit();
        }   
        $stmt_update->close();
    } else {
        header("Location: /web-final/setting.php?error=invalid_credentials"); 
    }

    $stmt->close();
    $conn->close();
}
