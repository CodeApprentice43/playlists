<?php



header('Access-Control-Allow-Origin: https://se-prod.cse.buffalo.edu/CSE442/2024-Fall/cse-442l/'); // Replace with your frontend URL
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Allow POST and OPTIONS methods
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Allow necessary headers
header('Access-Control-Allow-Credentials: true'); // Allow credentials (cookies, session)


// Include the database connection file
require_once 'db_connection.php';

// Start the session
session_start();

// Check if user ID is stored in the session
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'User is not logged in.',
    ]);
    exit;
}

// Assign the user ID from the session to a variable
$user_id = $_SESSION['user_id'];

try {
    // Prepare the SQL statement to delete the user
    $stmt = $conn->prepare("DELETE FROM tbdusers WHERE id = ?");
    $stmt->bind_param("i", $user_id); // Bind user ID as an integer parameter

    // Execute the query
    if ($stmt->execute()) {
        // On success, destroy the session and return a success message
        session_destroy();
        echo json_encode([
            'success' => true,
            'message' => 'Account deleted successfully.',
        ]);
    } else {
        // If the deletion fails, return an error message
        echo json_encode([
            'success' => false,
            'message' => 'Failed to delete account. Please try again.',
        ]);
    }

    // Close the prepared statement
    $stmt->close();
} catch (Exception $e) {
    // Catch and return any exceptions that occur
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred: ' . $e->getMessage(),
    ]);
}

// Close the database connection
$conn->close();
?>
