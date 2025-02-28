<?php
require 'db.php';  

// Start the session
session_start();

// Enable JSON response
header('Content-Type: application/json');

// Decode JSON request
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['email'], $data['password'])) {
    $email = trim($data['email']);
    $password = trim($data['password']);

    try {
        // Prepare a query to fetch user data
        $stmt = $pdo->prepare("SELECT acc_id, acc_password FROM tbl_account WHERE acc_email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['acc_password'])) {
            // Set session variables
            $_SESSION['user_id'] = $user['acc_id'];
            $_SESSION['user_email'] = $email;

            // Redirect to dashboard
            echo json_encode([
                'success' => true,
                'redirect_url' => 'dashboard.php',
                'message' => 'Login successful.',
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Invalid email or password.',
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Database error. Please try again later.',
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Missing email or password.',
    ]);
}
