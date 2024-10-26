<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// If you're making a POST request, also allow the necessary methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// If you’re sending custom headers, include this line
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// If you're handling preflight (OPTIONS) requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include your database connection
require 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];

    // Check if the email exists in the database
    $stmt = $conn->prepare("SELECT * FROM tbdusers WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        // Generate a token and expiry date
        $token = bin2hex(random_bytes(50)); // 50-byte random token
        $expiry = date('Y-m-d H:i:s', strtotime('+1 hour')); // 1-hour expiry time

        // Store the reset token and expiry in the database
        $stmt = $conn->prepare("UPDATE tbdusers SET reset_token = ?, reset_token_expiry = ? WHERE email = ?");
        $stmt->bind_param('sss', $token, $expiry, $email);
        $stmt->execute();

        // Prepare the email details
        $subject = "Password Reset Request";
        $resetLink = "https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/skim243/php/reset-password.php?token=$token";
        $message = "Hi,\n\nWe received a request to reset your password. Click the link below to reset your password:\n\n$resetLink\n\nThis link will expire in 1 hour.\n\nIf you did not request a password reset, please ignore this email.";
        $headers = "From: asaha5@buffalo.edu\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        // Send the email
        if (mail($email, $subject, $message, $headers)) {
            echo "A password reset link has been sent to your email just now.";
        } else {
            echo "There was a problem sending the email.";
        }
    } else {
        echo "Oops! TBD couldn't find you at the email $email";
    }
}
