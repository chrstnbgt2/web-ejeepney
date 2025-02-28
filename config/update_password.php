<?php
session_start();
include 'db.php';  

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_SESSION['user_email'] ?? null;
    if (!$email) {
        echo json_encode(["status" => "error", "message" => "User not logged in!"]);
        exit();
    }

    $currentPassword = trim($_POST['currentPassword'] ?? '');
    $newPassword = trim($_POST['newPassword'] ?? '');
    $confirmPassword = trim($_POST['confirmPassword'] ?? '');

    if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
        echo json_encode(["status" => "error", "message" => "All fields are required!"]);
        exit();
    }

    try {
        // Fetch current password
        $stmt = $pdo->prepare("SELECT acc_password FROM tbl_account WHERE acc_email = :email");
        $stmt->bindParam(":email", $email, PDO::PARAM_STR);
        $stmt->execute();
        $hashedPassword = $stmt->fetchColumn();

        if (!$hashedPassword) {
            echo json_encode(["status" => "error", "message" => "User not found!"]);
            exit();
        }

        if (!password_verify($currentPassword, $hashedPassword)) {
            echo json_encode(["status" => "error", "message" => "Current password is incorrect!"]);
            exit();
        }

        if ($newPassword !== $confirmPassword) {
            echo json_encode(["status" => "error", "message" => "New passwords do not match!"]);
            exit();
        }

        $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        $updateStmt = $pdo->prepare("UPDATE tbl_account SET acc_password = :newPassword WHERE acc_email = :email");
        $updateStmt->bindParam(":newPassword", $hashedNewPassword, PDO::PARAM_STR);
        $updateStmt->bindParam(":email", $email, PDO::PARAM_STR);

        if ($updateStmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Password updated successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error updating password. Try again."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    }
}
?>
