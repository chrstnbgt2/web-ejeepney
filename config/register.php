<?php
require 'db.php';  

// Enable JSON response
header('Content-Type: application/json');

// Decode JSON request
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['email'], $data['password'])) {
    $email = trim($data['email']);
    $password = trim($data['password']);

    try {
        // Check if the email is already registered
        $stmt = $pdo->prepare("SELECT acc_id FROM tbl_account WHERE acc_email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Email is already registered.']);
            exit;
        }

        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // Insert the user into the database
        $stmt = $pdo->prepare("INSERT INTO tbl_account (acc_email, acc_password, acc_created) VALUES (:email, :password, NOW())");
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->execute();

        echo json_encode(['success' => true, 'message' => 'Registration successful!']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing email or password.']);
}
?>

 